# 📋 Kommunikationsplan Generator

Eine umfassende Webanwendung zur systematischen Erstellung von Kommunikationsplänen nach PMI-Standards.

## 🚀 Features

- **5-Schritte-Wizard** für strukturierte Planerstellung
- **Stakeholder-Management** mit detaillierter Analyse
- **PDF & Excel Export** für professionelle Dokumentation
- **Automatische Validierung** mit Vollständigkeitsprüfung
- **Responsive Design** für Desktop und Mobile
- **PMI-Standards konform**

## 🛠️ Technologie-Stack

### Backend
- **Flask** (Python 3.11)
- **SQLAlchemy** ORM
- **SQLite** Datenbank
- **ReportLab** (PDF-Export)
- **OpenPyXL** (Excel-Export)

### Frontend
- **React 19** mit Vite
- **shadcn/ui** + Tailwind CSS
- **React Router** für Navigation
- **Lucide Icons**

## 📦 Installation

### Voraussetzungen
- Python 3.11+
- Node.js 20+
- pnpm

### Backend Setup
```bash
cd communication-plan-backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# oder: venv\Scripts\activate  # Windows
pip install -r requirements.txt
python src/main.py
```

### Frontend Setup
```bash
cd communication-plan-frontend
pnpm install
pnpm run dev
```

## 🎯 Verwendung

1. **Startseite besuchen**: `http://localhost:5173`
2. **"Plan erstellen"** klicken
3. **5-Schritte-Prozess** durchlaufen:
   - Projektbezogene Informationen
   - Stakeholder-Analyse
   - Organisatorische Rahmenbedingungen
   - Kommunikationsspezifische Details
   - Prozessdefinition
4. **Export** als PDF oder Excel
5. **Validierung** für Vollständigkeitsprüfung

## 📊 API-Endpunkte

### Projekte
- `GET /api/projects` - Alle Projekte
- `POST /api/projects` - Projekt erstellen
- `GET /api/projects/{id}` - Projekt abrufen
- `PUT /api/projects/{id}` - Projekt aktualisieren

### Export & Validierung
- `GET /api/projects/{id}/export/pdf` - PDF-Export
- `GET /api/projects/{id}/export/excel` - Excel-Export
- `GET /api/projects/{id}/validate` - Validierung

## 🏗️ Projektstruktur

```
├── communication-plan-backend/
│   ├── src/
│   │   ├── models/          # Datenmodelle
│   │   ├── routes/          # API-Routen
│   │   ├── static/          # Frontend-Build
│   │   └── main.py          # Flask-App
│   └── requirements.txt
├── communication-plan-frontend/
│   ├── src/
│   │   ├── components/      # React-Komponenten
│   │   ├── services/        # API-Services
│   │   └── App.jsx          # Haupt-App
│   └── package.json
└── README.md
```

## 🔧 Entwicklung

### Frontend-Build für Produktion
```bash
cd communication-plan-frontend
pnpm run build
cp -r dist/* ../communication-plan-backend/src/static/
```

### API-Tests
```bash
# Projekte abrufen
curl -X GET http://localhost:5002/api/projects

# PDF-Export testen
curl -X GET http://localhost:5002/api/projects/1/export/pdf -o test.pdf

# Validierung testen
curl -X GET http://localhost:5002/api/projects/1/validate
```

## 📋 Validierungskriterien

Die Anwendung prüft automatisch:
- ✅ Projektname (min. 3 Zeichen)
- ✅ Stakeholder-Vollständigkeit
- ✅ Wichtige Stakeholder-Rollen
- ✅ Kommunikationsplan-Details
- ✅ Kommunikationsmatrix

**Vollständigkeits-Score**: 0-100% mit detaillierten Empfehlungen

## 🎨 Screenshots

### Startseite
Übersichtliche Darstellung des 5-Schritte-Prozesses

### Wizard-Interface
Benutzerfreundlicher Assistent mit Fortschrittsanzeige

### Projektliste
Verwaltung aller Kommunikationspläne mit Such- und Exportfunktionen

## 🤝 Beitragen

1. Fork das Repository
2. Feature-Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request erstellen

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz.

## 🆘 Support

Bei Fragen oder Problemen:
- Dokumentation lesen: `PROJEKTDOKUMENTATION.md`
- Issue erstellen im Repository
- API-Tests mit curl durchführen

## 🔮 Roadmap

- [ ] Benutzer-Authentifizierung
- [ ] Projekt-Kollaboration
- [ ] E-Mail-Integration
- [ ] Dashboard mit Statistiken
- [ ] Template-System
- [ ] Mobile App

---

**Entwickelt für professionelles Projektmanagement nach PMI-Standards** 🎯

