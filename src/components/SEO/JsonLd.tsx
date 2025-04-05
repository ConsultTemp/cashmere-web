import React from 'react';

interface JsonLdProps {
  data: Record<string, any>;
}

// Componente per aggiungere dati strutturati JSON-LD
const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default JsonLd;
