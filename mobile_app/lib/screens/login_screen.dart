import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'ticket_list_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _employeeIdController = TextEditingController(text: 'TNEB-FT-4092');
  final _passwordController = TextEditingController(text: '••••••••');
  bool _isLoading = false;
  String? _errorMessage;

  void _handleLogin() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final success = await ApiService.login(
      _employeeIdController.text.trim(),
      _passwordController.text,
    );

    setState(() {
      _isLoading = false;
    });

    if (success && mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const TicketListScreen()),
      );
    } else {
      setState(() {
        _errorMessage = "Invalid Employee ID or authentication credentials.";
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F3EF),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Government Header Lockup
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: const Color(0xFF173B57), // Web Dashboard Deep Navy
                    borderRadius: BorderRadius.circular(8),
                    border: const Border(
                      top: BorderSide(color: Color(0xFFD7A445), width: 4), // Gold accent bar
                    ),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x1A173B57),
                        blurRadius: 16,
                        offset: Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      // Dual Logos: Tamil Nadu Government Emblem & TNEB Seal
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            width: 60,
                            height: 60,
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              color: const Color(0xFFFFF7E4),
                              shape: BoxShape.circle,
                              border: Border.all(color: const Color(0xFFD7A445), width: 2),
                              boxShadow: const [
                                BoxShadow(
                                  color: Color(0x40D7A445),
                                  blurRadius: 8,
                                ),
                              ],
                            ),
                            child: ClipOval(
                              child: Image.asset(
                                'assets/images/gov-logo.png',
                                fit: BoxFit.contain,
                                errorBuilder: (context, error, stackTrace) =>
                                    const Icon(Icons.account_balance, color: Color(0xFF173B57)),
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Container(
                            width: 60,
                            height: 60,
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              color: const Color(0xFFFFF7E4),
                              shape: BoxShape.circle,
                              border: Border.all(color: const Color(0xFFD7A445), width: 2),
                              boxShadow: const [
                                BoxShadow(
                                  color: Color(0x40D7A445),
                                  blurRadius: 8,
                                ),
                              ],
                            ),
                            child: ClipOval(
                              child: Image.asset(
                                'assets/images/tneb-logo.png',
                                fit: BoxFit.contain,
                                errorBuilder: (context, error, stackTrace) =>
                                    const Icon(Icons.bolt, color: Color(0xFF173B57)),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 18),
                      const Text(
                        'GOVERNMENT OF TAMIL NADU',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.5,
                          color: Color(0xFFD7A445), // Gold label
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Tamil Nadu Electricity Board',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                          letterSpacing: -0.5,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Transformer Health Command Desk',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(0xFFB7CBD5),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Technician Login Card
                Container(
                  padding: const EdgeInsets.all(24.0),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFFDF8), // Dashboard panel background
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: const Color(0xFFD9E1E4)),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x0F173B57),
                        blurRadius: 12,
                        offset: Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 4,
                            height: 18,
                            color: const Color(0xFFD7A445),
                          ),
                          const SizedBox(width: 8),
                          const Text(
                            'FIELD TECHNICIAN PORTAL',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 0.8,
                              color: Color(0xFF173B57),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      if (_errorMessage != null) ...[
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFF0EB),
                            borderRadius: BorderRadius.circular(4),
                            border: Border.all(color: const Color(0xFFC34C38)),
                          ),
                          child: Text(
                            _errorMessage!,
                            style: const TextStyle(
                              color: Color(0xFFC34C38),
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                      ],
                      const Text(
                        'Employee ID / Badge Number',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF6F8391)),
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: _employeeIdController,
                        style: const TextStyle(fontWeight: FontWeight.w600, color: Color(0xFF173B57)),
                        decoration: InputDecoration(
                          prefixIcon: const Icon(Icons.badge_outlined, color: Color(0xFF173B57)),
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(4),
                            borderSide: const BorderSide(color: Color(0xFFD9E1E4)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(4),
                            borderSide: const BorderSide(color: Color(0xFF173B57), width: 2),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'Access Password',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF6F8391)),
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: _passwordController,
                        obscureText: true,
                        style: const TextStyle(fontWeight: FontWeight.w600, color: Color(0xFF173B57)),
                        decoration: InputDecoration(
                          prefixIcon: const Icon(Icons.lock_outline, color: Color(0xFF173B57)),
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(4),
                            borderSide: const BorderSide(color: Color(0xFFD9E1E4)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(4),
                            borderSide: const BorderSide(color: Color(0xFF173B57), width: 2),
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: _isLoading ? null : _handleLogin,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF173B57), // Web Dashboard Primary
                          foregroundColor: Colors.white,
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ),
                        child: _isLoading
                            ? const SizedBox(
                                height: 20,
                                width: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: Color(0xFFD7A445),
                                ),
                              )
                            : const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.shield, size: 18, color: Color(0xFFD7A445)),
                                  SizedBox(width: 8),
                                  Text(
                                    'AUTHENTICATE & ENTER DESK',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 14,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                ],
                              ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),
                const Text(
                  'Official TNEB Government Field Operations Infrastructure\nVersion 1.0 • Authorized Personnel Only',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 11,
                    color: Color(0xFF6F8391),
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
