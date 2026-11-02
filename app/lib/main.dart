import 'package:flutter/material.dart';

import 'converter_screen.dart';
import 'platform_files.dart';

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
      theme: _theme(accent, Brightness.light),
      darkTheme: _theme(accent, Brightness.dark),
      home: const ConverterScreen(pickFiles: pickFilesFromDevice, saveFile: saveFileToDevice),
    );
  }

  /// Hindi file names and labels need a font we ship: in a browser, Flutter would otherwise
  /// fetch a missing font from Google, and nothing here may touch the network.
  ThemeData _theme(Color accent, Brightness brightness) {
    final base = ThemeData(colorSchemeSeed: accent, brightness: brightness);
    return base.copyWith(
      textTheme: base.textTheme.apply(fontFamilyFallback: const ['NotoSansDevanagari']),
    );
  }
}
