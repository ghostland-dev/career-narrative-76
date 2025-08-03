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

interface CVDisplayProps {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages?: Array<{ id: string; name: string; level: string; }>;
  interests?: string[];
  certifications?: Array<{ id: string; name: string; issuer: string; date: string; url?: string; }>;
  projects?: Array<{ id: string; name: string; description: string; technologies: string; url?: string; date: string; }>;
  templateStyle?: "modern" | "classic" | "minimal" | "print";
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
  templateStyle = "modern"
}) => {
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
  const headerStyles = templateStyle === "modern" 
    ? "bg-gradient-to-r from-primary/10 to-primary/5 border-l-4 border-primary"
    : "border-b-2 border-primary";

  return (
    <div className="w-full mx-auto bg-white text-black p-4 md:p-6 lg:p-8 print:p-4 print:m-0 print:max-w-none print:w-auto print:break-inside-avoid"
         style={{ minHeight: templateStyle === "print" ? "297mm" : "auto", maxWidth: templateStyle === "print" ? "210mm" : "none" }}>
      {/* En-tête optimisé */}
      <header className={`${templateStyle === "modern" ? "bg-gradient-to-r from-primary/5 to-primary/10" : ""} p-4 mb-4 rounded-lg print:break-inside-avoid`}>
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
              <p className="text-lg text-primary font-medium italic mb-3">
                {personalInfo.summary.split('.')[0]}
              </p>
            )}
            
            {/* Informations de contact - layout optimisé */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
              {personalInfo.email && (
                <div className="flex items-center">
                  <Mail className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center">
                  <Phone className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.address && (
                <div className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  <span>{personalInfo.address}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center">
                  <Globe className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  <span>{personalInfo.website}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center">
                  <Linkedin className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  <span>{personalInfo.linkedin}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Layout responsive en colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 print:gap-3">
        {/* Colonne principale (responsive) */}
        <div className="lg:col-span-2 space-y-4 print:space-y-3">
          {/* Résumé professionnel */}
          {personalInfo.summary && (
            <section>
              <h2 className={`text-lg font-bold text-primary mb-2 pb-1 ${headerStyles}`}>
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
              <h2 className={`text-lg font-bold text-primary mb-3 pb-1 ${headerStyles}`}>
                Expérience Professionnelle
              </h2>
              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={index} className="relative">
                    <div className="mb-2">
                      <h3 className="text-base font-semibold text-gray-900 leading-tight">
                        {exp.title}
                      </h3>
                      <div className="text-sm text-primary font-medium">
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
              <h2 className={`text-lg font-bold text-primary mb-3 pb-1 ${headerStyles}`}>
                Formation
              </h2>
              <div className="space-y-3">
                {education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="text-base font-semibold text-gray-900 leading-tight">
                      {edu.degree}
                    </h3>
                    <div className="text-sm text-primary font-medium">
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
              <h2 className={`text-lg font-bold text-primary mb-3 pb-1 ${headerStyles}`}>
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
                        <span key={techIndex} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
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
              <h2 className={`text-lg font-bold text-primary mb-3 pb-1 ${headerStyles}`}>
                Compétences
              </h2>
              <div className="space-y-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="text-sm bg-gray-50 px-3 py-1.5 rounded-md border-l-3 border-primary/30"
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
              <h2 className={`text-base font-bold text-primary mb-2 pb-1 ${headerStyles}`}>
                Langues
              </h2>
              <div className="space-y-1 text-sm text-gray-700">
                {languages.map((language, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{language.name}</span>
                    <span className="text-primary font-medium">{language.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section>
              <h2 className={`text-base font-bold text-primary mb-2 pb-1 ${headerStyles}`}>
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
              <h2 className={`text-base font-bold text-primary mb-2 pb-1 ${headerStyles}`}>
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