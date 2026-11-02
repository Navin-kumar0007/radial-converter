import 'package:flutter/material.dart';

import 'preview/menu_preview.dart';

void main() {
  runApp(const RadialApp());
}

class RadialApp extends StatelessWidget {
  const RadialApp({super.key});

  @override
  Widget build(BuildContext context) {
    const accent = Color(0xFF0B6E5F);
    return MaterialApp(
      title: 'Radial Converter',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(colorSchemeSeed: accent),
      darkTheme: ThemeData(colorSchemeSeed: accent, brightness: Brightness.dark),
      home: const MenuPreview(),
    );
  }
}
