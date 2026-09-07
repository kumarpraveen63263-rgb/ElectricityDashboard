import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/ticket.dart';
import '../services/api_service.dart';
import '../widgets/status_badge.dart';
import 'ticket_detail_screen.dart';
import 'login_screen.dart';

class TicketListScreen extends StatefulWidget {
  const TicketListScreen({Key? key}) : super(key: key);

  @override
  State<TicketListScreen> createState() => _TicketListScreenState();
}

class _TicketListScreenState extends State<TicketListScreen> {
  List<Ticket> _tickets = [];
  bool _isLoading = true;
  String _filter = 'ALL';

  @override
  void initState() {
    super.initState();
    _loadTickets();
  }

  Future<void> _loadTickets() async {
    setState(() {
      _isLoading = true;
    });
    final tickets = await ApiService.fetchMyTickets();
    setState(() {
      _tickets = tickets;
      _isLoading = false;
    });
  }

  List<Ticket> get _filteredTickets {
    if (_filter == 'CRITICAL') {
      return _tickets.where((t) => t.severity == 'critical').toList();
    } else if (_filter == 'IN_PROGRESS') {
      return _tickets.where((t) => t.status == 'in_progress').toList();
    } else if (_filter == 'RESOLVED') {
      return _tickets.where((t) => t.status == 'resolved' || t.status == 'closed').toList();
    }
    return _tickets;
  }

  @override
  Widget build(BuildContext context) {
    final criticalCount = _tickets.where((t) => t.severity == 'critical').length;
    final inProgressCount = _tickets.where((t) => t.status == 'in_progress').length;
    final resolvedCount = _tickets.where((t) => t.status == 'resolved' || t.status == 'closed').length;

    return Scaffold(
      backgroundColor: const Color(0xFFF8F8F5), // Dashboard Paper
      appBar: AppBar(
        backgroundColor: const Color(0xFF173B57), // Web Dashboard Navy
        titleSpacing: 0,
        title: Row(
          children: [
            const SizedBox(width: 12),
            Container(
              width: 34,
              height: 34,
              padding: const EdgeInsets.all(2),
              decoration: const BoxDecoration(
                color: Color(0xFFFFF7E4),
                shape: BoxShape.circle,
              ),
              child: ClipOval(
                child: Image.asset(
                  'assets/images/gov-logo.png',
                  fit: BoxFit.contain,
                  errorBuilder: (context, error, stackTrace) =>
                      const Icon(Icons.account_balance, size: 18, color: Color(0xFF173B57)),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Container(
              width: 34,
              height: 34,
              padding: const EdgeInsets.all(2),
              decoration: const BoxDecoration(
                color: Color(0xFFFFF7E4),
                shape: BoxShape.circle,
              ),
              child: ClipOval(
                child: Image.asset(
                  'assets/images/tneb-logo.png',
                  fit: BoxFit.contain,
                  errorBuilder: (context, error, stackTrace) =>
                      const Icon(Icons.bolt, size: 18, color: Color(0xFF173B57)),
                ),
              ),
            ),
            const SizedBox(width: 10),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'TNEB CONTROL ROOM',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.2,
                    color: Color(0xFFD7A445), // Gold Accent
                  ),
                ),
                Text(
                  'Field Technician Desk',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.white),
            onPressed: _loadTickets,
          ),
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            onPressed: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (_) => const LoginScreen()),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Control Room Technician Header Strip
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: const BoxDecoration(
              color: Color(0xFF1E4966),
              border: Border(
                bottom: BorderSide(color: Color(0xFFD7A445), width: 2),
              ),
            ),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 18,
                  backgroundColor: Color(0xFFD7A445),
                  child: Icon(Icons.engineering, color: Color(0xFF173B57), size: 20),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        ApiService.currentEmployeeName ?? 'Field Technician',
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 2),
                      const Text(
                        'Role: Field Technician • Scope: Assigned Work Orders',
                        style: TextStyle(
                          color: Color(0xFFB7CBD5),
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFF173B57),
                    borderRadius: BorderRadius.circular(3),
                    border: Border.all(color: const Color(0xFFD7A445)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 6,
                        height: 6,
                        decoration: const BoxDecoration(
                          color: Color(0xFF46AF8A), // Online green
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 6),
                      const Text(
                        'LIVE SYSTEM',
                        style: TextStyle(
                          color: Color(0xFFE2C277),
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Web Dashboard KPI Metric Strip
          Container(
            padding: const EdgeInsets.all(12),
            color: const Color(0xFFF1F3EF),
            child: Row(
              children: [
                _buildKpiCard('ACTIVE', _tickets.length.toString(), const Color(0xFF173B57)),
                const SizedBox(width: 8),
                _buildKpiCard('CRITICAL', criticalCount.toString(), const Color(0xFFC34C38)),
                const SizedBox(width: 8),
                _buildKpiCard('IN PROGRESS', inProgressCount.toString(), const Color(0xFFBA8628)),
                const SizedBox(width: 8),
                _buildKpiCard('RESOLVED', resolvedCount.toString(), const Color(0xFF2D8A74)),
              ],
            ),
          ),

          // Filter Segment Tabs
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: const BoxDecoration(
              color: Color(0xFFFFFDF8),
              border: Border(
                top: BorderSide(color: Color(0xFFD9E1E4)),
                bottom: BorderSide(color: Color(0xFFD9E1E4)),
              ),
            ),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildFilterTab('ALL', 'All Tasks (${_tickets.length})'),
                  const SizedBox(width: 6),
                  _buildFilterTab('CRITICAL', 'Critical ($criticalCount)'),
                  const SizedBox(width: 6),
                  _buildFilterTab('IN_PROGRESS', 'In Progress ($inProgressCount)'),
                  const SizedBox(width: 6),
                  _buildFilterTab('RESOLVED', 'Resolved ($resolvedCount)'),
                ],
              ),
            ),
          ),

          // Tickets List
          Expanded(
            child: _isLoading
                ? const Center(
                    child: CircularProgressIndicator(
                      color: Color(0xFF173B57),
                    ),
                  )
                : _filteredTickets.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.assignment_outlined, size: 54, color: Colors.grey[400]),
                            const SizedBox(height: 12),
                            const Text(
                              'No assigned tickets match the selected filter.',
                              style: TextStyle(color: Color(0xFF6F8391), fontSize: 13),
                            ),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _loadTickets,
                        color: const Color(0xFF173B57),
                        child: ListView.builder(
                          padding: const EdgeInsets.all(12),
                          itemCount: _filteredTickets.length,
                          itemBuilder: (context, index) {
                            final ticket = _filteredTickets[index];
                            return _buildTicketCard(ticket);
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildKpiCard(String label, String value, Color accentColor) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 8),
        decoration: BoxDecoration(
          color: const Color(0xFFFFFDF8),
          borderRadius: BorderRadius.circular(4),
          border: Border.all(color: const Color(0xFFD9E1E4)),
        ),
        child: Column(
          children: [
            Text(
              label,
              style: const TextStyle(
                fontSize: 9,
                fontWeight: FontWeight.bold,
                letterSpacing: 0.5,
                color: Color(0xFF6F8391),
              ),
            ),
            const SizedBox(height: 2),
            Text(
              value,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: accentColor,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterTab(String value, String label) {
    final isSelected = _filter == value;
    return GestureDetector(
      onTap: () {
        setState(() {
          _filter = value;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF173B57) : Colors.transparent,
          borderRadius: BorderRadius.circular(4),
          border: Border.all(
            color: isSelected ? const Color(0xFF173B57) : const Color(0xFFD9E1E4),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? const Color(0xFFD7A445) : const Color(0xFF6F8391),
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
            fontSize: 11,
          ),
        ),
      ),
    );
  }

  Widget _buildTicketCard(Ticket ticket) {
    final dateFormat = DateFormat('MMM dd, hh:mm a');
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFDF8),
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: const Color(0xFFD9E1E4)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x08173B57),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: InkWell(
        onTap: () async {
          final updated = await Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => TicketDetailScreen(ticket: ticket),
            ),
          );
          if (updated == true) {
            _loadTickets();
          }
        },
        borderRadius: BorderRadius.circular(4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Card Gold Accent Line
            Container(
              height: 3,
              decoration: BoxDecoration(
                color: ticket.severity == 'critical'
                    ? const Color(0xFFC34C38)
                    : ticket.severity == 'high'
                        ? const Color(0xFFBA8628)
                        : const Color(0xFF2D8A74),
                borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(14.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        ticket.ticketNumber,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                          color: Color(0xFF173B57),
                          letterSpacing: 0.5,
                        ),
                      ),
                      Row(
                        children: [
                          StatusBadge(label: ticket.severity, type: 'severity'),
                          const SizedBox(width: 6),
                          StatusBadge(label: ticket.status, type: 'status'),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    ticket.title,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      color: Color(0xFF173B57),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8F8F5),
                      borderRadius: BorderRadius.circular(4),
                      border: Border.all(color: const Color(0xFFE9EEEE)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.bolt, size: 16, color: Color(0xFFD7A445)),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            '${ticket.transformerName} • ${ticket.transformerCode}',
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF173B57),
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.location_on, size: 14, color: Color(0xFFC34C38)),
                      const SizedBox(width: 4),
                      Text(
                        ticket.zoneName,
                        style: const TextStyle(fontSize: 11, color: Color(0xFF6F8391)),
                      ),
                      const Spacer(),
                      const Icon(Icons.schedule, size: 13, color: Color(0xFF6F8391)),
                      const SizedBox(width: 4),
                      Text(
                        dateFormat.format(ticket.createdAt),
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
    );
  }
}
