import 'package:flutter/material.dart';
import 'package:fuse_wallet_sdk/fuse_wallet_sdk.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Fuse Staking App',
      home: WalletScreen(),
    );
  }
}

class WalletScreen extends StatefulWidget {
  @override
  _WalletScreenState createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> {
  final apiKey = 'YOUR_API_KEY';
  final privateKey = EthPrivateKey.fromHex('YOUR_PRIVATE_KEY');
  late FuseSDK fuseSDK;
  String _address = '';
  final tokenController = TextEditingController();
  String selectedToken = "Fuse";  // Default to Fuse
  bool _isStaking = false;
  String _transactionHash = "";

  @override
  void initState() {
    super.initState();
    initFuseSDK();
  }

  Future<void> initFuseSDK() async {
    fuseSDK = await FuseSDK.init(apiKey, privateKey);
    setState(() {
      _address = fuseSDK.wallet.getSender();
    });
  }

  Future<void> stakeTokens() async {
    setState(() {
      _isStaking = true;
    });
    try {
      String tokenAddress = selectedToken == "Fuse" ? "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" : "0x34Ef2Cc892a88415e9f02b91BfA9c91fC0bE6bD4";  // Use actual addresses
      final res = await fuseSDK.stakeToken(
        StakeRequestBody(
          accountAddress: _address,
          tokenAmount: tokenController.text,
          tokenAddress: tokenAddress,
        ),
      );
      print('UserOpHash: ${res.userOpHash}');
      print('Waiting for transaction...');
      final ev = await res.wait();
      if (ev != null && ev is FilterEvent) {
      String transactionHash = ev.transactionHash ?? "Unknown";  // Extracting the transaction hash from the event
      setState(() {
        _transactionHash = 'Transaction Hash: $transactionHash';
        _isStaking = false;
      });
      print(_transactionHash);
    } else {
      throw Exception("Failed to retrieve transaction details.");
    }
    } catch (e) {
      setState(() {
        _transactionHash = "Error: ${e.toString()}";
        _isStaking = false;
      });
      print(_transactionHash);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Fuse Wallet and Staking App'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            if (_address.isNotEmpty)
              Text('Wallet Address: $_address'),
            if (_transactionHash.isNotEmpty)
              Text(_transactionHash),
            TextField(
              controller: tokenController,
              decoration: InputDecoration(labelText: 'Token Amount'),
            ),
            DropdownButton<String>(
              value: selectedToken,
              onChanged: (String? newValue) {
                setState(() {
                  selectedToken = newValue!;
                });
              },
              items: <String>['Fuse', 'Volt']
                  .map<DropdownMenuItem<String>>((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
            ),
            ElevatedButton(
              onPressed: _isStaking ? null : stakeTokens,
              child: _isStaking ? CircularProgressIndicator() : Text('Stake Tokens'),
            ),
          ],
        ),
      ),
    );
  }
}