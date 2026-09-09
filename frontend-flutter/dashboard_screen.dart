import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  // -1: Main Dashboard (Sin píldoras activas)
  // 0: Merma, 1: Paros, 2: Monitoreo, 3: Historial
  int _selectedIndex = -1;

  void _resetToMainDashboard() {
    setState(() {
      _selectedIndex = -1;
    });
  }

  Widget _buildBodyContent() {
    switch (_selectedIndex) {
      case 0:
        return const Center(child: Text('Vista de Captura de Merma'));
      case 1:
        return const Center(child: Text('Vista de Paros de Línea'));
      case 2:
        return const Center(child: Text('Vista de Monitoreo de Inyectoras'));
      case 3:
        return const Center(child: Text('Vista de Historial y Reportes'));
      case -1:
      default:
        return const _MainDashboardContent();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEAF2FB),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E3A5F),
        elevation: 2,
        toolbarHeight: 56,
        automaticallyImplyLeading: false,
        titleSpacing: 16,
        title: Row(
          children: [
            InkWell(
              onTap: _resetToMainDashboard,
              borderRadius: BorderRadius.circular(8),
              child: Container(
                height: 36,
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(8),
                  boxShadow: const [
                    BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 1))
                  ],
                ),
                child: Image.network(
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuAxfsHF5Ob5Z3JX61JIAaGmh0QHcFmQE2-owzMJHUjaHiMUUWk2NJbOwrdm4TZuAI6F7F4Am2Qtmtffcf8cx7B6G2Cc34i2MexuNvlE7mcs5D8yXgdySG7tmVrWpfhtpoeDHBfjEJ6oZ9iWYPQf4RSm9p6ZGTRkWmgveFRoi4LhwHJ1fdHv6cyLMmsJ1ui9KN70S76IpwdER3frR8TMG80Y1ZuSEnsHMd8gPwkCkbPvVgKGwnO-U9gJ8QR3hsV6WH92F3gngFRnwQGOIg',
                  fit: BoxFit.contain,
                  errorBuilder: (context, error, stackTrace) => const Icon(
                    Icons.precision_manufacturing_rounded,
                    size: 20,
                    color: Color(0xFF1E3A5F),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Text(
              'Panel Principal',
              style: GoogleFonts.inter(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.menu_rounded, color: Colors.white, size: 24),
            onPressed: () {},
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: _buildBodyContent(),
      bottomNavigationBar: Container(
        height: 64,
        decoration: const BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Color.fromRGBO(30, 58, 95, 0.08),
              blurRadius: 12,
              offset: Offset(0, -2),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildNavItem(
              index: 0,
              icon: Icons.scale_outlined,
              activeIcon: Icons.scale_rounded,
              label: 'Merma',
            ),
            _buildNavItem(
              index: 1,
              icon: Icons.pause_circle_outline,
              activeIcon: Icons.pause_circle_rounded,
              label: 'Paros',
            ),
            _buildNavItem(
              index: 2,
              icon: Icons.grid_view_outlined,
              activeIcon: Icons.grid_view_rounded,
              label: 'Monitoreo',
            ),
            _buildNavItem(
              index: 3,
              icon: Icons.show_chart_outlined,
              activeIcon: Icons.show_chart_rounded,
              label: 'Historial',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem({
    required int index,
    required IconData icon,
    required IconData activeIcon,
    required String label,
  }) {
    final bool isSelected = _selectedIndex == index;

    return Expanded(
      child: InkWell(
        onTap: () {
          setState(() {
            _selectedIndex = index;
          });
        },
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              height: 3,
              width: 24,
              margin: const EdgeInsets.only(bottom: 4),
              decoration: BoxDecoration(
                color: isSelected ? const Color(0xFF0162A2) : Colors.transparent,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            Icon(
              isSelected ? activeIcon : icon,
              size: 22,
              color: isSelected ? const Color(0xFF022448) : const Color(0xFF6B7280),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                color: isSelected ? const Color(0xFF022448) : const Color(0xFF6B7280),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MainDashboardContent extends StatelessWidget {
  const _MainDashboardContent();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16.0),
      children: [
        Row(
          children: [
            Expanded(
              child: _buildKpiCard(
                title: 'Total Mermas',
                value: '142.8',
                unit: 'kg',
                icon: Icons.hourglass_empty_rounded,
                iconColor: const Color(0xFF0162A2),
                bgColor: const Color(0xFFE0F2FE),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildKpiCard(
                title: 'Tiempo Muerto',
                value: '03:45',
                unit: 'hrs',
                icon: Icons.timer_outlined,
                iconColor: const Color(0xFFE0A526),
                bgColor: const Color(0xFFFEF3C7),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        _buildSectionCard(
          title: 'Mermas por Inyectora',
          icon: Icons.bar_chart_rounded,
          badge: 'Hoy',
          badgeColor: const Color(0xFFE6EEFF),
          badgeTextColor: const Color(0xFF6B7280),
          child: SizedBox(
            height: 140,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                _buildBarItem('18kg', 0.315, 'INY-01', isCritical: false),
                _buildBarItem('45kg', 0.789, 'INY-02', isCritical: false),
                _buildBarItem('22kg', 0.385, 'INY-03', isCritical: false),
                _buildBarItem('57kg', 1.0, 'INY-04', isCritical: true),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        _buildSectionCard(
          title: 'Causas de Paros',
          icon: Icons.pie_chart_outline_rounded,
          iconColor: const Color(0xFFD64545),
          badge: 'Crítico',
          badgeColor: const Color(0xFFFFDAD6),
          badgeTextColor: const Color(0xFFD64545),
          child: Row(
            children: [
              SizedBox(
                width: 110,
                height: 110,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    const SizedBox(
                      width: 100,
                      height: 100,
                      child: CircularProgressIndicator(
                        value: 0.45,
                        strokeWidth: 10,
                        backgroundColor: Color(0xFF3B82C4),
                        color: Color(0xFFD64545),
                      ),
                    ),
                    Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('Total', style: GoogleFonts.inter(fontSize: 11, color: const Color(0xFF6B7280))),
                        Text('3h 45m', style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.bold, color: const Color(0xFF121C2A))),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  children: [
                    _buildLegendItem('Falla Mecánica', '45%', const Color(0xFFD64545)),
                    const SizedBox(height: 6),
                    _buildLegendItem('Ajuste de Molde', '35%', const Color(0xFFE0A526)),
                    const SizedBox(height: 6),
                    _buildLegendItem('Cambio Material', '20%', const Color(0xFF3B82C4)),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        // Aquí agregamos la nueva tarjeta
        _buildRecentRecordsCard(context),
      ],
    );
  }

  Widget _buildRecentRecordsCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12.0),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 1))
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.history_rounded, size: 20, color: Color(0xFF1E3A5F)),
                  const SizedBox(width: 8),
                  Text(
                    'Registros Recientes',
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF121C2A),
                    ),
                  ),
                ],
              ),
              InkWell(
                onTap: () {},
                child: Row(
                  children: [
                    Text(
                      'Historial',
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF0162A2),
                      ),
                    ),
                    const SizedBox(width: 2),
                    const Icon(Icons.chevron_right_rounded, size: 18, color: Color(0xFF0162A2)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _buildRecentRecordItem(
            icon: Icons.warning_amber_rounded,
            iconBgColor: const Color(0xFFFCE8E6),
            iconColor: const Color(0xFFD64545),
            machine: 'Inyectora 04',
            time: '10:42 AM',
            description: 'Paro Mecánico - Atasco de expulsor',
            tag1Text: '-25 min',
            tag1Bg: const Color(0xFFFFE2E2),
            tag1Color: const Color(0xFFD64545),
            tag2Text: 'Célula A',
            tag2Bg: const Color(0xFFE8F0FE),
            tag2Color: const Color(0xFF4A6572),
          ),
          const SizedBox(height: 8),
          _buildRecentRecordItem(
            icon: Icons.delete_outline_rounded,
            iconBgColor: const Color(0xFFFEF3C7),
            iconColor: const Color(0xFFD97706),
            machine: 'Inyectora 02',
            time: '09:15 AM',
            description: 'Scrap reportado - Ráfagas / rebaba',
            tag1Text: '12.4 kg',
            tag1Bg: const Color(0xFFFEF3C7),
            tag1Color: const Color(0xFFB45309),
            tag2Text: 'Polipropileno',
            tag2Bg: const Color(0xFFE8F0FE),
            tag2Color: const Color(0xFF4A6572),
          ),
          const SizedBox(height: 8),
          _buildRecentRecordItem(
            icon: Icons.check_circle_outline_rounded,
            iconBgColor: const Color(0xFFE6F4EA),
            iconColor: const Color(0xFF1E8E3E),
            machine: 'Inyectora 01',
            time: '08:30 AM',
            description: 'Cambio de Molde completado',
          ),
        ],
      ),
    );
  }

  Widget _buildRecentRecordItem({
    required IconData icon,
    required Color iconBgColor,
    required Color iconColor,
    required String machine,
    required String time,
    required String description,
    String? tag1Text,
    Color? tag1Bg,
    Color? tag1Color,
    String? tag2Text,
    Color? tag2Bg,
    Color? tag2Color,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: iconBgColor,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: iconColor, size: 22),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      machine,
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: const Color(0xFF121C2A),
                      ),
                    ),
                    Text(
                      time,
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        color: const Color(0xFF6B7280),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  description,
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    color: const Color(0xFF4B5563),
                    fontWeight: FontWeight.w500,
                  ),
                ),
                if (tag1Text != null || tag2Text != null) ...[
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      if (tag1Text != null)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: tag1Bg,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            tag1Text,
                            style: GoogleFonts.inter(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: tag1Color,
                            ),
                          ),
                        ),
                      if (tag1Text != null && tag2Text != null) const SizedBox(width: 6),
                      if (tag2Text != null)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: tag2Bg,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            tag2Text,
                            style: GoogleFonts.inter(
                              fontSize: 11,
                              fontWeight: FontWeight.w500,
                              color: tag2Color,
                            ),
                          ),
                        ),
                    ],
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildKpiCard({
    required String title,
    required String value,
    required String unit,
    required IconData icon,
    required Color iconColor,
    required Color bgColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12.0),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 1))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF6B7280), fontWeight: FontWeight.w500)),
              Container(padding: const EdgeInsets.all(6), decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(8)), child: Icon(icon, size: 18, color: iconColor)),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(value, style: GoogleFonts.inter(fontSize: 26, fontWeight: FontWeight.bold, color: const Color(0xFF121C2A))),
              const SizedBox(width: 4),
              Text(unit, style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF6B7280))),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSectionCard({
    required String title,
    required IconData icon,
    Color iconColor = const Color(0xFF0162A2),
    required String badge,
    required Color badgeColor,
    required Color badgeTextColor,
    required Widget child,
  }) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12.0),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 1))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(icon, size: 20, color: iconColor),
                  const SizedBox(width: 8),
                  Text(title, style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: const Color(0xFF121C2A))),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: badgeColor, borderRadius: BorderRadius.circular(6)),
                child: Text(badge, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: badgeTextColor)),
              ),
            ],
          ),
          const SizedBox(height: 16),
          child,
        ],
      ),
    );
  }

  Widget _buildBarItem(String valText, double heightFactor, String label, {required bool isCritical}) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (isCritical) const Icon(Icons.warning_amber_rounded, size: 12, color: Color(0xFFD64545)),
            Text(
              valText,
              style: GoogleFonts.inter(
                fontSize: 11,
                color: isCritical ? const Color(0xFFD64545) : const Color(0xFF6B7280),
                fontWeight: isCritical ? FontWeight.bold : FontWeight.w500,
              ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        Container(
          width: 38,
          height: 80 * heightFactor,
          decoration: BoxDecoration(
            color: isCritical ? const Color(0xFF022448) : const Color(0xFF3B82C4),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(6)),
          ),
        ),
        const SizedBox(height: 8),
        Text(label, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: isCritical ? const Color(0xFF0162A2) : const Color(0xFF121C2A))),
      ],
    );
  }

  Widget _buildLegendItem(String label, String percent, Color dotColor) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(color: const Color(0xFFEFF4FF), borderRadius: BorderRadius.circular(8)),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(width: 10, height: 10, decoration: BoxDecoration(color: dotColor, shape: BoxShape.circle)),
              const SizedBox(width: 8),
              Text(label, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500, color: const Color(0xFF121C2A))),
            ],
          ),
          Text(percent, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: dotColor)),
        ],
      ),
    );
  }
}