import React from 'react';
import { useKeycloakContext } from '../../../services/useKeycloakContext';
import CoachCalendar from './CoachCalendar';
import ClientCalendar from './ClientCalendar';


const CalendarContainer: React.FC = () => {
  const { keycloak } = useKeycloakContext();
  const roles = keycloak?.tokenParsed?.realm_access?.roles || [];
  
  const isCoach = roles.includes('COACH');
  const isClient = roles.includes('CLIENT');

  if (isCoach) {
    return <CoachCalendar />;
  } else if (isClient) {
    return <ClientCalendar />;
  } else {
    return (
      <div className="p-8 text-center">
        <p>Accès non autorisé. Veuillez compléter votre inscription.</p>
      </div>
    );
  }
};

export default CalendarContainer;