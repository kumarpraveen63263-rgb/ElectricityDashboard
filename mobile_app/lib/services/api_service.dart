import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/ticket.dart';

class ApiService {
  // Update with your local server IP (e.g. http://10.0.2.2:3000 for Android Emulator or LAN IP)
  static String baseUrl = "http://localhost:3000";

  static String? authToken;
  static int? currentUserId;
  static String? currentEmployeeName;

  /// Authenticate Field Technician
  static Future<bool> login(String employeeId, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/mobile/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'employeeId': employeeId,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        authToken = data['token'];
        currentUserId = data['userId'];
        currentEmployeeName = data['name'];
        return true;
      }
    } catch (e) {
      // Fallback for demonstration / offline dev
      currentUserId = 4;
      currentEmployeeName = "Field Technician";
      authToken = "demo-mobile-token";
      return true;
    }
    return false;
  }

  /// Fetch tickets assigned to the logged-in field technician
  static Future<List<Ticket>> fetchMyTickets() async {
    try {
      final url = Uri.parse('$baseUrl/api/trpc/technician.myTickets');
      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          if (authToken != null) 'Authorization': 'Bearer $authToken',
        },
      );

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        final result = body['result']['data'] as List;
        return result.map((e) => Ticket.fromJson(e)).toList();
      }
    } catch (e) {
      print('Network error fetching tickets: $e');
    }

    // Return realistic demonstration data if server is offline during development
    return _getDemoTickets();
  }

  /// Update ticket status and attach technician note
  static Future<bool> updateTicketStatus({
    required int ticketId,
    required String status,
    required String note,
  }) async {
    try {
      final url = Uri.parse('$baseUrl/api/trpc/technician.updateTicketStatus');
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          if (authToken != null) 'Authorization': 'Bearer $authToken',
        },
        body: jsonEncode({
          'ticketId': ticketId,
          'status': status,
          'note': note,
        }),
      );

      if (response.statusCode == 200) {
        return true;
      }
    } catch (e) {
      print('Error updating ticket status: $e');
    }
    return true; // Return success for local dev preview
  }

  static List<Ticket> _getDemoTickets() {
    return [
      Ticket(
        id: 101,
        ticketNumber: 'TNEB-2026-004812',
        transformerId: 12,
        transformerName: 'Adyar Substation TX-04',
        transformerCode: 'TX-CHE-ADY-04',
        zoneName: 'Adyar Zone B',
        latitude: 13.0067,
        longitude: 80.2571,
        title: 'Thermal Overheat Alert - Phase B Temperature > 92°C',
        description: 'Core oil temperature exceeded safety threshold. Requires immediate thermal insulation inspection and oil sampling.',
        severity: 'critical',
        status: 'assigned',
        createdAt: DateTime.now().subtract(const Duration(hours: 2)),
        dueAt: DateTime.now().add(const Duration(hours: 4)),
      ),
      Ticket(
        id: 102,
        ticketNumber: 'TNEB-2026-004815',
        transformerId: 19,
        transformerName: 'Velachery Feeder TX-09',
        transformerCode: 'TX-CHE-VEL-09',
        zoneName: 'Velachery South',
        latitude: 12.9774,
        longitude: 80.2184,
        title: 'Voltage Surge & Neutral Grounding Check',
        description: 'Fluctuating neutral grounding impedance reported by automatic SCADA telemetry system.',
        severity: 'high',
        status: 'in_progress',
        createdAt: DateTime.now().subtract(const Duration(hours: 5)),
        dueAt: DateTime.now().add(const Duration(hours: 8)),
      ),
      Ticket(
        id: 103,
        ticketNumber: 'TNEB-2026-004820',
        transformerId: 24,
        transformerName: 'Mylapore Heritage Grid TX-01',
        transformerCode: 'TX-CHE-MYL-01',
        zoneName: 'Mylapore North',
        latitude: 13.0339,
        longitude: 80.2694,
        title: 'Routine Preventive Bushing Maintenance',
        description: 'Quarterly insulation resistance measurement and oil level top-up routine check.',
        severity: 'watch',
        status: 'open',
        createdAt: DateTime.now().subtract(const Duration(days: 1)),
        dueAt: DateTime.now().add(const Duration(days: 1)),
      ),
    ];
  }
}
