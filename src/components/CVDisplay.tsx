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
  templateStyle?: "modern" | "classic" | "minimal";
}

const CVDisplay: React.FC<CVDisplayProps> = ({
  personalInfo,
  experience,
  education,
  skills,
  templateStyle = "modern"
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Présent";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' });
  };

  // Styles optimisés pour A4
  const baseStyles = "text-gray-800 leading-tight";
  const headerStyles = templateStyle === "modern" 
    ? "bg-gradient-to-r from-primary/10 to-primary/5 border-l-4 border-primary"
    : "border-b-2 border-primary";

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white text-black min-h-[297mm] p-6 print:p-4 print:m-0 print:max-w-none print:w-auto print:break-inside-avoid">
      {/* En-tête optimisé */}
      <header className={`${templateStyle === "modern" ? "bg-gradient-to-r from-primary/5 to-primary/10" : ""} p-4 mb-4 rounded-lg print:break-inside-avoid`}>
        {/* Nom et titre */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">
            {personalInfo.fullName || "Nom non renseigné"}
          </h1>
          {personalInfo.summary && (
            <p className="text-lg text-primary font-medium italic">
              {personalInfo.summary.split('.')[0]}
            </p>
          )}
        </div>

        {/* Informations de contact - layout optimisé */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-gray-600">
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
      </header>

      {/* Layout en deux colonnes pour optimiser l'espace */}
      <div className="grid grid-cols-3 gap-4 print:gap-3">
        {/* Colonne principale (2/3) */}
        <div className="col-span-2 space-y-4 print:space-y-3">
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
        </div>

        {/* Colonne secondaire (1/3) */}
        <div className="col-span-1 space-y-4 print:space-y-3">
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

          {/* Espace pour informations complémentaires */}
          <section className="space-y-3">
            {/* Langues */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Langues</h3>
              <div className="space-y-1 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Français</span>
                  <span className="text-primary">Natif</span>
                </div>
                <div className="flex justify-between">
                  <span>Anglais</span>
                  <span className="text-primary">Courant</span>
                </div>
              </div>
            </div>

            {/* Centres d'intérêt */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Centres d'intérêt</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <div>• Technologies émergentes</div>
                <div>• Sport et bien-être</div>
                <div>• Voyages et cultures</div>
              </div>
            </div>
          </section>
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