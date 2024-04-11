import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:fuse_wallet_sdk/fuse_wallet_sdk.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Smart Contract Wallet',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: WalletCreationScreen(),
    );
  }
}

class WalletCreationScreen extends HookWidget {
  @override
  Widget build(BuildContext context) {
    final createWallet = useState<String?>(null);

    Future<void> _createSmartContractWallet() async {
      const apiKey = 'API_Key';
      final privateKey = EthPrivateKey.fromHex('Private_Key');

      try {
        final fuseSDK = await FuseSDK.init(apiKey, privateKey);
        String address = fuseSDK.wallet.getSender();

        createWallet.value = address;
print('Smart contract wallet address: ${createWallet.value}');
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => TransferScreen(fuseSDK: fuseSDK, walletAddress: address),
          ),
        );
      } catch (e) {
        // Handle initialization error
        print('Error during wallet creation: $e');
      }
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('FuseBox Mobile App'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            ElevatedButton(
              onPressed: () {
                _createSmartContractWallet();
              },
              child: Text('Create Smart Contract Wallet'),
            ),
            SizedBox(height: 20),
            if (createWallet.value != null)
              Text('Wallet Address: ${createWallet.value}'),
              
          ],
        ),
      ),
    );
  }
}

class TransferScreen extends HookWidget {
  final FuseSDK fuseSDK;
  final String walletAddress;


  TransferScreen({required this.fuseSDK, required this.walletAddress});

  Future<void> _transferFunds() async {
    try {
      final res = await fuseSDK.transferToken(
        EthereumAddress.fromHex('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'), // Replace with your token address
        EthereumAddress.fromHex('0xb6e4fa6ff2873480590c68D9Aa991e5BB14Dbf03'), // Replace with recipient's address
        BigInt.parse('0'), // Replace with the amount in Wei
      );

      print('UserOpHash: ${res.userOpHash}');
      print('Waiting for transaction...');

      final ev = await res.wait();
      print('Transaction successful... Hash ${ev}');
      // Handle success, you can show a success message or navigate to another screen
    } catch (e) {
      // Handle the error, you can show an error message or log it
      print('Error during transfer: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Transfer Screen'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          
          children: <Widget>[
            Text('Wallet Address: ${walletAddress}'),
            Text('Transfer funds here'),
            ElevatedButton(
              onPressed: () {
                _transferFunds();
              },
              child: Text('Transfer Funds'),
            ),
          ],
        ),
      ),
    );
  }
}
