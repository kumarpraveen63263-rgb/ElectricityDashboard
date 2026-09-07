class Ticket {
  final int id;
  final String ticketNumber;
  final int transformerId;
  final String transformerName;
  final String transformerCode;
  final String zoneName;
  final double latitude;
  final double longitude;
  final String title;
  final String? description;
  final String severity; // 'critical', 'high', 'watch'
  final String status;   // 'open', 'assigned', 'in_progress', 'resolved', 'closed'
  final DateTime? dueAt;
  final DateTime createdAt;

  Ticket({
    required this.id,
    required this.ticketNumber,
    required this.transformerId,
    required this.transformerName,
    required this.transformerCode,
    required this.zoneName,
    required this.latitude,
    required this.longitude,
    required this.title,
    this.description,
    required this.severity,
    required this.status,
    this.dueAt,
    required this.createdAt,
  });

  factory Ticket.fromJson(Map<String, dynamic> json) {
    return Ticket(
      id: json['id'] as int,
      ticketNumber: json['ticketNumber'] as String? ?? 'TNEB-TICKET',
      transformerId: json['transformerId'] as int,
      transformerName: json['transformerName'] as String? ?? 'Transformer Asset',
      transformerCode: json['transformerCode'] as String? ?? 'TX-ASSET',
      zoneName: json['zoneName'] as String? ?? 'Assigned Zone',
      latitude: (json['latitude'] as num?)?.toDouble() ?? 13.0827,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 80.2707,
      title: json['title'] as String? ?? 'Fault Ticket',
      description: json['description'] as String?,
      severity: json['severity'] as String? ?? 'high',
      status: json['status'] as String? ?? 'assigned',
      dueAt: json['dueAt'] != null ? DateTime.tryParse(json['dueAt']) : null,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'ticketNumber': ticketNumber,
      'transformerId': transformerId,
      'transformerName': transformerName,
      'transformerCode': transformerCode,
      'zoneName': zoneName,
      'latitude': latitude,
      'longitude': longitude,
      'title': title,
      'description': description,
      'severity': severity,
      'status': status,
      'dueAt': dueAt?.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
