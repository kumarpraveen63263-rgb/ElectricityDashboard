import 'package:flutter/material.dart';
import 'screens/login_screen.dart';

void main() {
  runApp(const TnebFieldApp());
}

class TnebFieldApp extends StatelessWidget {
  const TnebFieldApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TNEB Field Operations',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        scaffoldBackgroundColor: const Color(0xFFF8F8F5), // Dashboard paper color
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF173B57), // Web Dashboard Navy
          primary: const Color(0xFF173B57),
          secondary: const Color(0xFFD7A445), // Web Dashboard Gold
          surface: const Color(0xFFFFFDF8),
        ),
        cardTheme: CardThemeData(
          color: const Color(0xFFFFFDF8),
          elevation: 0,
          shape: RoundedRectangleBorder(
            side: const BorderSide(color: Color(0xFFD9E1E4), width: 1),
            borderRadius: BorderRadius.circular(4),
          ),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF173B57),
          foregroundColor: Colors.white,
          elevation: 0,
        ),
        fontFamily: 'Roboto',
      ),
      home: const LoginScreen(),
    );
  }
}
