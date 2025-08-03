import React from "react";
import { Mail, Phone, MapPin, Calendar, Globe, Linkedin } from "lucide-react";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  website?: string;
  linkedin?: string;
  photo_url?: string;
  birthDate?: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface SpacingSettings {
  pageMargin: number;
  sectionSpacing: number;
  itemSpacing: number;
  lineHeight: number;
  headerPadding: number;
  contentPadding: number;
  borderRadius: number;
  fontSize: number;
}

interface CVDisplayProps {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages?: Array<{ id: string; name: string; level: string; }>;
  interests?: string[];
  certifications?: Array<{ id: string; name: string; issuer: string; date: string; url?: string; }>;
  projects?: Array<{ id: string; name: string; description: string; technologies: string; url?: string; date: string; }>;
  templateStyle?: "modern" | "classic" | "minimal" | "print" | "creative" | "professional" | "elegant" | "tech";
  spacingSettings?: SpacingSettings;
}

const CVDisplay: React.FC<CVDisplayProps> = ({
  personalInfo,
  experience,
  education,
  skills,
  languages = [],
  interests = [],
  certifications = [],
  projects = [],
  templateStyle = "modern",
  spacingSettings
}) => {
  // Paramètres par défaut
  const defaultSpacing: SpacingSettings = {
    pageMargin: 32,
    sectionSpacing: 24,
    itemSpacing: 16,
    lineHeight: 1.5,
    headerPadding: 16,
    contentPadding: 16,
    borderRadius: 8,
    fontSize: 14
  };

  const spacing = spacingSettings || defaultSpacing;
  const formatDate = (dateString: string) => {
    if (!dateString) return "Présent";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' });
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Styles optimisés pour A4
  const baseStyles = "text-gray-800 leading-tight";
  
  const getTemplateStyles = () => {
    switch (templateStyle) {
      case "modern":
        return {
          headerStyles: "bg-gradient-to-r from-primary/10 to-primary/5 border-l-4 border-primary",
          containerBg: "bg-white",
          accentColor: "text-primary",
          cardStyle: "bg-gray-50 border-l-3 border-primary/30"
        };
      case "classic":
        return {
          headerStyles: "border-b-2 border-gray-800 bg-gray-50",
          containerBg: "bg-white",
          accentColor: "text-gray-800",
          cardStyle: "bg-white border border-gray-200"
        };
      case "minimal":
        return {
          headerStyles: "border-b border-gray-300",
          containerBg: "bg-white",
          accentColor: "text-gray-700",
          cardStyle: "bg-white"
        };
      case "creative":
        return {
          headerStyles: "bg-gradient-to-r from-purple-100 to-pink-100 border-l-4 border-purple-500 rounded-r-lg",
          containerBg: "bg-gradient-to-br from-white to-purple-50",
          accentColor: "text-purple-600",
          cardStyle: "bg-gradient-to-r from-purple-50 to-pink-50 border-l-3 border-purple-400 rounded"
        };
      case "professional":
        return {
          headerStyles: "bg-slate-100 border-l-4 border-slate-600",
          containerBg: "bg-white",
          accentColor: "text-slate-700",
          cardStyle: "bg-slate-50 border border-slate-200 rounded"
        };
      case "elegant":
        return {
          headerStyles: "bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500",
          containerBg: "bg-gradient-to-b from-white to-amber-50/30",
          accentColor: "text-amber-700",
          cardStyle: "bg-white border border-amber-200 rounded-lg shadow-sm"
        };
      case "tech":
        return {
          headerStyles: "bg-gradient-to-r from-blue-100 to-cyan-100 border-l-4 border-blue-500",
          containerBg: "bg-gradient-to-br from-white to-blue-50/50",
          accentColor: "text-blue-600",
          cardStyle: "bg-blue-50/50 border border-blue-200 rounded-md"
        };
      case "print":
      default:
        return {
          headerStyles: "border-b-2 border-primary",
          containerBg: "bg-white",
          accentColor: "text-primary",
          cardStyle: "bg-gray-50 border-l-3 border-primary/30"
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div 
      className={`w-full mx-auto text-black print:m-0 print:max-w-none print:w-auto print:break-inside-avoid ${styles.containerBg}`}
      style={{ 
        minHeight: templateStyle === "print" ? "297mm" : "auto", 
        maxWidth: templateStyle === "print" ? "210mm" : "none",
        padding: `${spacing.pageMargin}px`,
        fontSize: `${spacing.fontSize}px`,
        lineHeight: spacing.lineHeight
      }}
    >
      {/* En-tête optimisé */}
      <header 
        className={`${styles.headerStyles} print:break-inside-avoid`}
        style={{ 
          padding: `${spacing.headerPadding}px`,
          marginBottom: `${spacing.sectionSpacing}px`,
          borderRadius: `${spacing.borderRadius}px`
        }}
      >
        {/* Layout avec photo */}
        <div className="flex items-start gap-6 mb-4">
          {/* Photo de profil */}
          {personalInfo.photo_url && (
            <div className="flex-shrink-0">
              <img
                src={personalInfo.photo_url}
                alt="Photo de profil"
                className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
              />
            </div>
          )}
          
          {/* Informations principales */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">
              {personalInfo.fullName || "Nom non renseigné"}
              {personalInfo.birthDate && (
                <span className="text-lg font-normal text-gray-600 ml-2">
                  ({calculateAge(personalInfo.birthDate)} ans)
                </span>
              )}
            </h1>
            {personalInfo.summary && (
              <p className={`text-lg font-medium italic mb-3 ${styles.accentColor}`}>
                {personalInfo.summary.split('.')[0]}
              </p>
            )}
            
            {/* Informations de contact - layout optimisé */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
              {personalInfo.email && (
                <div className="flex items-center">
                  <Mail className={`h-3.5 w-3.5 mr-1.5 ${styles.accentColor}`} />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center">
                  <Phone className={`h-3.5 w-3.5 mr-1.5 ${styles.accentColor}`} />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.address && (
                <div className="flex items-center">
                  <MapPin className={`h-3.5 w-3.5 mr-1.5 ${styles.accentColor}`} />
                  <span>{personalInfo.address}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center">
                  <Globe className={`h-3.5 w-3.5 mr-1.5 ${styles.accentColor}`} />
                  <span>{personalInfo.website}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center">
                  <Linkedin className={`h-3.5 w-3.5 mr-1.5 ${styles.accentColor}`} />
                  <span>{personalInfo.linkedin}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Layout responsive en colonnes */}
      <div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 print:gap-3"
        style={{ gap: `${spacing.sectionSpacing}px` }}
      >
        {/* Colonne principale (responsive) */}
        <div className="lg:col-span-2 space-y-4 print:space-y-3">
          {/* Résumé professionnel */}
          {personalInfo.summary && (
            <section>
              <h2 className={`text-lg font-bold mb-2 pb-1 ${styles.accentColor} ${styles.headerStyles}`}>
                Profil Professionnel
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {personalInfo.summary}
              </p>
            </section>
          )}

          {/* Expérience professionnelle */}
          {experience.length > 0 && (
            <section>
              <h2 className={`text-lg font-bold mb-3 pb-1 ${styles.accentColor} ${styles.headerStyles}`}>
                Expérience Professionnelle
              </h2>
              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={index} className="relative">
                    <div className="mb-2">
                      <h3 className="text-base font-semibold text-gray-900 leading-tight">
                        {exp.title}
                      </h3>
                      <div className={`text-sm font-medium ${styles.accentColor}`}>
                        {exp.company} {exp.location && `• ${exp.location}`}
                      </div>
                      <div className="text-xs text-gray-600 flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Formation */}
          {education.length > 0 && (
            <section>
              <h2 className={`text-lg font-bold mb-3 pb-1 ${styles.accentColor} ${styles.headerStyles}`}>
                Formation
              </h2>
              <div className="space-y-3">
                {education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="text-base font-semibold text-gray-900 leading-tight">
                      {edu.degree}
                    </h3>
                    <div className={`text-sm font-medium ${styles.accentColor}`}>
                      {edu.institution} {edu.location && `• ${edu.location}`}
                    </div>
                    <div className="text-xs text-gray-600 flex items-center mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </div>
                    {edu.description && (
                      <p className="text-sm text-gray-700 leading-relaxed mt-1">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projets */}
          {projects.length > 0 && (
            <section>
              <h2 className={`text-lg font-bold mb-3 pb-1 ${styles.accentColor} ${styles.headerStyles}`}>
                Projets
              </h2>
              <div className="space-y-3">
                {projects.map((project, index) => (
                  <div key={index}>
                    <h3 className="text-base font-semibold text-gray-900 leading-tight">
                      {project.name}
                    </h3>
                    <div className="text-xs text-gray-600 mb-1">
                      {formatDate(project.date)}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.split(',').map((tech, techIndex) => (
                        <span key={techIndex} className={`text-xs px-2 py-0.5 rounded ${styles.cardStyle.includes('bg-') ? styles.cardStyle.split(' ')[0] + '/20' : 'bg-primary/10'} ${styles.accentColor}`}>
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Colonne secondaire (responsive) */}
        <div className="lg:col-span-1 space-y-4 print:space-y-3">
          {/* Compétences */}
          {skills.length > 0 && (
            <section>
              <h2 className={`text-lg font-bold mb-3 pb-1 ${styles.accentColor} ${styles.headerStyles}`}>
                Compétences
              </h2>
              <div className="space-y-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className={`text-sm px-3 py-1.5 rounded-md ${styles.cardStyle}`}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Langues */}
          {languages.length > 0 && (
            <section>
              <h2 className={`text-base font-bold mb-2 pb-1 ${styles.accentColor} ${styles.headerStyles}`}>
                Langues
              </h2>
              <div className="space-y-1 text-sm text-gray-700">
                {languages.map((language, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{language.name}</span>
                    <span className={`font-medium ${styles.accentColor}`}>{language.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section>
              <h2 className={`text-base font-bold mb-2 pb-1 ${styles.accentColor} ${styles.headerStyles}`}>
                Certifications
              </h2>
              <div className="space-y-2">
                {certifications.map((cert, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium text-gray-900">{cert.name}</div>
                    <div className="text-xs text-gray-600">{cert.issuer}</div>
                    <div className="text-xs text-gray-500">{formatDate(cert.date)}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Centres d'intérêt */}
          {interests.length > 0 && (
            <section>
              <h2 className={`text-base font-bold mb-2 pb-1 ${styles.accentColor} ${styles.headerStyles}`}>
                Centres d'intérêt
              </h2>
              <div className="text-sm text-gray-700 space-y-1">
                {interests.map((interest, index) => (
                  <div key={index}>• {interest}</div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Footer discret */}
      <footer className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          CV généré le {new Date().toLocaleDateString('fr-FR')}
        </p>
      </footer>
    </div>
  );
};

export default CVDisplay;