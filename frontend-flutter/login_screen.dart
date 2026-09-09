import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/auth_service.dart';
import 'dashboard_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _userController = TextEditingController();
  final _passwordController = TextEditingController();
  final _authService = AuthService();

  bool _obscurePassword = true;
  bool _rememberUser = true;
  bool _isLoading = false;
  bool _isSuccess = false;

  void _handleAuthSubmit() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      bool success = await _authService.login(
        _userController.text,
        _passwordController.text,
      );

      await Future.delayed(const Duration(milliseconds: 1100));

      if (success) {
        setState(() {
          _isLoading = false;
          _isSuccess = true;
        });

        await Future.delayed(const Duration(milliseconds: 600));

        if (!mounted) return;
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const DashboardScreen()),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEAF2FB),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 20.0),
            child: Container(
              constraints: const BoxConstraints(maxWidth: 384),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Column(
                    children: [
                      Container(
                        constraints: const BoxConstraints(maxWidth: 240),
                        margin: const EdgeInsets.only(bottom: 12),
                        child: Image.network(
                          'https://lh3.googleusercontent.com/aida-public/AB6AXuCn-q-_HtiKCQIM1KwRWvnfW5lL4xYU4-bIGELT1rrRdDI2TitXp1O7Yp-serUY3eHlUE1-XwqnXB8bpiDjTRGcXfCu1B3hrGEt0V-irjuKg_Z33KZJZIUX6DN1YHwaPrRxYQReFai-a4Dw29FzR_mqPTe7IwBYdh6QHrSlqXAdQTVS7Z1Y19KMcZl3nEUkzvsc9STx3OVCP5M1pd0tuuR_LmJV_XvQGnlk3yA_JE5Pv2sBI_hMkklLBhcrIwTADHyCIw',
                          fit: BoxFit.contain,
                          errorBuilder: (context, error, stackTrace) => const Icon(
                            Icons.precision_manufacturing_rounded,
                            size: 64,
                            color: Color(0xFF1E3A5F),
                          ),
                        ),
                      ),
                      Text(
                        'Inicia sesión',
                        style: GoogleFonts.inter(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: const Color(0xFF1F2937),
                          letterSpacing: -0.24,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(20.0),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12.0),
                      boxShadow: const [
                        BoxShadow(
                          color: Colors.black12,
                          blurRadius: 6,
                          offset: Offset(0, 2),
                        )
                      ],
                    ),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Usuario:',
                                style: GoogleFonts.inter(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: const Color(0xFF1F2937),
                                ),
                              ),
                              Text(
                                'ID de planta',
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  color: const Color(0xFF6B7280),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          TextFormField(
                            controller: _userController,
                            style: GoogleFonts.inter(fontSize: 14, color: const Color(0xFF1F2937)),
                            decoration: InputDecoration(
                              hintText: 'Ej. operador01@plastitrack.com',
                              hintStyle: GoogleFonts.inter(color: const Color(0xFF74777F)),
                              prefixIcon: const Icon(Icons.badge_outlined, color: Color(0xFF74777F), size: 20),
                              filled: true,
                              fillColor: const Color(0xFFEFF4FF),
                              contentPadding: const EdgeInsets.symmetric(vertical: 12),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8.0),
                                borderSide: const BorderSide(color: Color(0xFFE2E5EA)),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8.0),
                                borderSide: const BorderSide(color: Color(0xFFE2E5EA)),
                              ),
                            ),
                            validator: (val) => (val == null || val.isEmpty) ? 'Campo requerido' : null,
                          ),
                          const SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Contraseña:',
                                style: GoogleFonts.inter(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: const Color(0xFF1F2937),
                                ),
                              ),
                              Text(
                                'PIN / Clave',
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  color: const Color(0xFF6B7280),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          TextFormField(
                            controller: _passwordController,
                            obscureText: _obscurePassword,
                            style: GoogleFonts.inter(fontSize: 14, color: const Color(0xFF1F2937)),
                            decoration: InputDecoration(
                              hintText: '••••••••',
                              hintStyle: GoogleFonts.inter(color: const Color(0xFF74777F)),
                              prefixIcon: const Icon(Icons.lock_outline, color: Color(0xFF74777F), size: 20),
                              suffixIcon: IconButton(
                                icon: Icon(
                                  _obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                                  color: const Color(0xFF74777F),
                                  size: 20,
                                ),
                                onPressed: () {
                                  setState(() {
                                    _obscurePassword = !_obscurePassword;
                                  });
                                },
                              ),
                              filled: true,
                              fillColor: const Color(0xFFEFF4FF),
                              contentPadding: const EdgeInsets.symmetric(vertical: 12),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8.0),
                                borderSide: const BorderSide(color: Color(0xFFE2E5EA)),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8.0),
                                borderSide: const BorderSide(color: Color(0xFFE2E5EA)),
                              ),
                            ),
                            validator: (val) => (val == null || val.isEmpty) ? 'Campo requerido' : null,
                          ),
                          const SizedBox(height: 16),
                          SizedBox(
                            width: double.infinity,
                            height: 48,
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: _isSuccess
                                    ? const Color(0xFF2E9E5B)
                                    : const Color(0xFF1E3A5F),
                                foregroundColor: Colors.white,
                                elevation: 1,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8.0),
                                ),
                              ),
                              onPressed: _isLoading ? null : _handleAuthSubmit,
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    _isSuccess
                                        ? '¡Acceso Correcto!'
                                        : _isLoading
                                            ? 'Verificando estación...'
                                            : 'Iniciar Sesión',
                                    style: GoogleFonts.inter(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  if (_isLoading)
                                    const SizedBox(
                                      width: 18,
                                      height: 18,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        color: Colors.white,
                                      ),
                                    )
                                  else
                                    Icon(
                                      _isSuccess ? Icons.check_circle_outline : Icons.arrow_forward,
                                      size: 20,
                                    ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Checkbox(
                                value: _rememberUser,
                                activeColor: const Color(0xFF022448),
                                onChanged: (val) {
                                  setState(() {
                                    _rememberUser = val ?? true;
                                  });
                                },
                              ),
                              Text(
                                'Recordar mi usuario',
                                style: GoogleFonts.inter(
                                  fontSize: 14,
                                  color: const Color(0xFF1F2937),
                                ),
                              ),
                            ],
                          ),
                          Center(
                            child: TextButton(
                              onPressed: () {},
                              child: Text(
                                '¿Olvidaste tu contraseña?',
                                style: GoogleFonts.inter(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                  color: const Color(0xFF3B82C4),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}