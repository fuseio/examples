import 'package:flutter/material.dart';
import 'package:fuse_wallet_sdk/fuse_wallet_sdk.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Token Swap App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: TokenSwapScreen(),
    );
  }
}

class TokenSwapScreen extends StatefulWidget {
  @override
  _TokenSwapScreenState createState() => _TokenSwapScreenState();
}

class _TokenSwapScreenState extends State<TokenSwapScreen> {
  final _formKey = GlobalKey<FormState>();
  TextEditingController _amountController = TextEditingController();
  bool _isLoading = false;
  String _swapStatus = '';
  String _selectedToken = 'usdc'; // Set initial value

  @override
  void dispose() {
    _amountController.dispose();
    super.dispose();
  }

  Future<void> _swapTokens() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
    });

    final credentials = EthPrivateKey.fromHex('WALLET_PRIVATE_KEY');
    final publicApiKey = 'YOUR_PUBLIC_API_KEY';
    final fuseSDK = await FuseSDK.init(
      publicApiKey,
      credentials,
    );

    final amount = BigInt.parse(_amountController.text.trim());

    final nativeTokenAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
    final usdcTokenAddress = '0x28C3d1cD466Ba22f6cae51b1a4692a831696391A';
    final usdtTokenAddress = '0xFaDbBF8Ce7D5b7041bE672561bbA99f79c532e10';
    final voltTokenAddress = '0x34Ef2Cc892a88415e9f02b91BfA9c91fC0bE6bD4';

    String outputTokenAddress;
    switch (_selectedToken) {
      case 'usdc':
        outputTokenAddress = usdcTokenAddress;
        break;
      case 'usdt':
        outputTokenAddress = usdtTokenAddress;
        break;
      case 'volt':
        outputTokenAddress = voltTokenAddress;
        break;
      default:
        outputTokenAddress = usdcTokenAddress; // Default to usdc
    }

    try {
      final res = await fuseSDK.swapTokens(
        TradeRequest(
          inputToken: nativeTokenAddress,
          outputToken: outputTokenAddress,
          inputAmount: amount,
          exactIn: true,
        ),
      );

      setState(() {
        _swapStatus = 'UserOpHash: ${res.userOpHash}';
      });

      final ev = await res.wait();
      setState(() {
        _swapStatus = 'Transaction hash: ${ev?.transactionHash}';
      });

      print('UserOpHash: ${res.userOpHash}'); // Log userOpHash to console
    } catch (error) {
      setState(() {
        _swapStatus = 'Error: $error';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Token Swap'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              DropdownButtonFormField<String>(
                value: _selectedToken,
                onChanged: (value) {
                  setState(() {
                    _selectedToken = value!;
                  });
                },
                items: [
                  DropdownMenuItem(
                    value: 'usdc',
                    child: Text('USDC'),
                  ),
                  DropdownMenuItem(
                    value: 'usdt',
                    child: Text('USDT'),
                  ),
                  DropdownMenuItem(
                    value: 'volt',
                    child: Text('VOLT'),
                  ),
                ],
                decoration: InputDecoration(labelText: 'Token'),
              ),
              SizedBox(height: 20),
              TextFormField(
                controller: _amountController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(labelText: 'Amount'),
                validator: (value) {
                  if (value!.isEmpty) {
                    return 'Please enter an amount';
                  }
                  return null;
                },
              ),
              SizedBox(height: 20),
              _isLoading
                  ? CircularProgressIndicator()
                  : ElevatedButton(
                      onPressed: _swapTokens,
                      child: Text('Swap Tokens'),
                    ),
              SizedBox(height: 20),
              Text(_swapStatus),
            ],
          ),
        ),
      ),
    );
  }
}
