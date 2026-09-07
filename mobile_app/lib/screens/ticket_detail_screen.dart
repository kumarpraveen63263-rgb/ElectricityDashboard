import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/ticket.dart';
import '../services/api_service.dart';
import '../widgets/status_badge.dart';

class TicketDetailScreen extends StatefulWidget {
  final Ticket ticket;

  const TicketDetailScreen({Key? key, required this.ticket}) : super(key: key);

  @override
  State<TicketDetailScreen> createState() => _TicketDetailScreenState();
}

class _TicketDetailScreenState extends State<TicketDetailScreen> {
  late String _currentStatus;
  final _noteController = TextEditingController();
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _currentStatus = widget.ticket.status;
  }

  Future<void> _launchGoogleMaps(double lat, double lng) async {
    final googleMapsUrl = Uri.parse('google.navigation:q=$lat,$lng&mode=d');
    final webUrl = Uri.parse('https://www.google.com/maps/search/?api=1&query=$lat,$lng');
    try {
      if (await canLaunchUrl(googleMapsUrl)) {
        await launchUrl(googleMapsUrl);
      } else {
        await launchUrl(webUrl, mode: LaunchMode.externalApplication);
      }
    } catch (e) {
      await launchUrl(webUrl, mode: LaunchMode.externalApplication);
    }
  }


  void _updateStatus(String newStatus) async {
    final note = _noteController.text.trim();
    if (note.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter technician field inspection note before updating status.'),
          backgroundColor: Color(0xFFC34C38),
        ),
      );
      return;
    }

    setState(() {
      _isSubmitting = true;
    });

    final success = await ApiService.updateTicketStatus(
      ticketId: widget.ticket.id,
      status: newStatus,
      note: note,
    );

    setState(() {
      _isSubmitting = false;
    });

    if (success && mounted) {
      setState(() {
        _currentStatus = newStatus;
        _noteController.clear();
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Ticket status updated to ${newStatus.replaceAll('_', ' ').toUpperCase()}'),
          backgroundColor: const Color(0xFF217558),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('EEE, MMM dd yyyy - hh:mm a');

    return Scaffold(
      backgroundColor: const Color(0xFFF8F8F5), // Dashboard Paper
      appBar: AppBar(
        backgroundColor: const Color(0xFF173B57), // Web Dashboard Navy
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.ticket.ticketNumber,
              style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const Text(
              'WORK ORDER DETAIL',
              style: TextStyle(color: Color(0xFFD7A445), fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1),
            ),
          ],
        ),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Header Card
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFFFFFDF8),
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: const Color(0xFFD9E1E4)),
                boxShadow: const [
                  BoxShadow(color: Color(0x08173B57), blurRadius: 6, offset: Offset(0, 2)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    height: 3,
                    decoration: const BoxDecoration(
                      color: Color(0xFFD7A445), // Gold Accent Bar
                      borderRadius: BorderRadius.vertical(top: Radius.circular(4)),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            StatusBadge(label: widget.ticket.severity, type: 'severity'),
                            StatusBadge(label: _currentStatus, type: 'status'),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text(
                          widget.ticket.title,
                          style: const TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF173B57),
                          ),
                        ),
                        if (widget.ticket.description != null) ...[
                          const SizedBox(height: 8),
                          Text(
                            widget.ticket.description!,
                            style: const TextStyle(fontSize: 13, color: Color(0xFF6F8391), height: 1.45),
                          ),
                        ],
                        const Divider(height: 24, color: Color(0xFFD9E1E4)),
                        Row(
                          children: [
                            const Icon(Icons.schedule, size: 14, color: Color(0xFF6F8391)),
                            const SizedBox(width: 6),
                            Text(
                              'Logged: ${dateFormat.format(widget.ticket.createdAt)}',
                              style: const TextStyle(fontSize: 11, color: Color(0xFF6F8391)),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Transformer Context & GPS Navigation Card
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFFFFFDF8),
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: const Color(0xFFD9E1E4)),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.bolt, color: Color(0xFFD7A445)),
                        SizedBox(width: 8),
                        Text(
                          'TRANSFORMER ASSET LOCATION',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.8,
                            color: Color(0xFF173B57),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    _buildInfoRow('Transformer Name', widget.ticket.transformerName),
                    _buildInfoRow('Asset Code', widget.ticket.transformerCode),
                    _buildInfoRow('Zone Region', widget.ticket.zoneName),
                    _buildInfoRow(
                      'GPS Coordinates',
                      '${widget.ticket.latitude.toStringAsFixed(4)}° N, ${widget.ticket.longitude.toStringAsFixed(4)}° E',
                    ),
                    const SizedBox(height: 14),
                    ElevatedButton.icon(
                      onPressed: () => _launchGoogleMaps(widget.ticket.latitude, widget.ticket.longitude),
                      icon: const Icon(Icons.navigation, color: Color(0xFFD7A445)),
                      label: const Text('NAVIGATE TO ASSET GPS'),

                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF173B57),
                        foregroundColor: Colors.white,
                        minimumSize: const Size(double.infinity, 44),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Field Action & Status Update Section
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFFFFFDF8),
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: const Color(0xFFD9E1E4)),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'TECHNICIAN FIELD LOG & STATUS',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.8,
                        color: Color(0xFF173B57),
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _noteController,
                      maxLines: 3,
                      style: const TextStyle(fontSize: 13, color: Color(0xFF173B57)),
                      decoration: InputDecoration(
                        labelText: 'Inspection Notes & Observations',
                        hintText: 'Enter physical inspection findings, oil levels, or thermal readings...',
                        filled: true,
                        fillColor: const Color(0xFFF8F8F5),
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
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: _isSubmitting || _currentStatus == 'in_progress'
                                ? null
                                : () => _updateStatus('in_progress'),
                            icon: const Icon(Icons.play_arrow_rounded),
                            label: const Text('IN PROGRESS'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFBA8628), // Dashboard Gold Accent
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: _isSubmitting || _currentStatus == 'resolved'
                                ? null
                                : () => _updateStatus('resolved'),
                            icon: const Icon(Icons.check_circle_outline),
                            label: const Text('MARK RESOLVED'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF2D8A74), // Dashboard Sea Green
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF6F8391))),
          Text(value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF173B57))),
        ],
      ),
    );
  }
}
