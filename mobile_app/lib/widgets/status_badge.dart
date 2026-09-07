import 'package:flutter/material.dart';

class StatusBadge extends StatelessWidget {
  final String label;
  final String type; // 'severity' or 'status'

  const StatusBadge({
    Key? key,
    required this.label,
    this.type = 'status',
  }) : super(key: key);

  Color _getBackgroundColor() {
    final lower = label.toLowerCase();
    if (type == 'severity') {
      switch (lower) {
        case 'critical':
        case 'high':
          return const Color(0xFFFFF0EB);
        case 'watch':
        default:
          return const Color(0xFFFFF4DA);
      }
    } else {
      switch (lower) {
        case 'assigned':
          return const Color(0xFFE8EDEB);
        case 'in_progress':
          return const Color(0xFFFFF4DA);
        case 'resolved':
          return const Color(0xFFE4F3ED);
        case 'closed':
          return const Color(0xFFF3F4F6);
        case 'open':
        default:
          return const Color(0xFFFFF0EB);
      }
    }
  }

  Color _getTextColor() {
    final lower = label.toLowerCase();
    if (type == 'severity') {
      switch (lower) {
        case 'critical':
        case 'high':
          return const Color(0xFFA33E2C);
        case 'watch':
        default:
          return const Color(0xFF8F620D);
      }
    } else {
      switch (lower) {
        case 'assigned':
          return const Color(0xFF173B57);
        case 'in_progress':
          return const Color(0xFF8F620D);
        case 'resolved':
          return const Color(0xFF217558);
        case 'closed':
          return const Color(0xFF374151);
        case 'open':
        default:
          return const Color(0xFFA33E2C);
      }
    }
  }

  String _formatLabel() {
    return label.replaceAll('_', ' ').toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: _getBackgroundColor(),
        borderRadius: BorderRadius.circular(3),
        border: Border.all(
          color: _getTextColor().withOpacity(0.2),
          width: 1,
        ),
      ),
      child: Text(
        _formatLabel(),
        style: TextStyle(
          color: _getTextColor(),
          fontSize: 10,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
