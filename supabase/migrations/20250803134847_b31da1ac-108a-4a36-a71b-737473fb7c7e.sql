-- Insert additional CV templates with different designs and themes
INSERT INTO cv_templates (id, name, description, styles, is_premium) VALUES 
('creative', 'Créatif', 'Design moderne avec touches colorées pour secteurs créatifs', 
 '{"layout": "two-column", "primaryColor": "#6366f1", "accentColor": "#ec4899", "fontFamily": "Inter", "style": "creative"}', false),

('executive', 'Executive', 'Design sobre et élégant pour postes de direction', 
 '{"layout": "single-column", "primaryColor": "#1f2937", "accentColor": "#059669", "fontFamily": "Playfair Display", "style": "executive"}', true),

('tech', 'Tech', 'Template optimisé pour développeurs et métiers techniques', 
 '{"layout": "two-column", "primaryColor": "#0ea5e9", "accentColor": "#f59e0b", "fontFamily": "JetBrains Mono", "style": "tech"}', false),

('minimal', 'Minimaliste', 'Design épuré et professionnel', 
 '{"layout": "single-column", "primaryColor": "#374151", "accentColor": "#6b7280", "fontFamily": "Inter", "style": "minimal"}', false),

('academic', 'Académique', 'Template pour chercheurs et professions académiques', 
 '{"layout": "single-column", "primaryColor": "#7c3aed", "accentColor": "#c084fc", "fontFamily": "EB Garamond", "style": "academic"}', false),

('marketing', 'Marketing', 'Design dynamique pour métiers du marketing et communication', 
 '{"layout": "two-column", "primaryColor": "#ef4444", "accentColor": "#f97316", "fontFamily": "Inter", "style": "marketing"}', true),

('finance', 'Finance', 'Template conservateur pour secteur financier', 
 '{"layout": "single-column", "primaryColor": "#1e40af", "accentColor": "#3b82f6", "fontFamily": "Times New Roman", "style": "finance"}', false),

('startup', 'Startup', 'Design moderne et innovant pour startups', 
 '{"layout": "two-column", "primaryColor": "#10b981", "accentColor": "#06d6a0", "fontFamily": "Inter", "style": "startup"}', true);