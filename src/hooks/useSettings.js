// a hook to load settings from server dhis2 object store

import { useEffect, useState } from "react";

const apiBase = process.env.REACT_APP_BASE_URI;
const useSettings = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(
          apiBase + "api/dataStore/public-dashboard/settings"
        );
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        setSettings({});
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  return settings;
};

export default useSettings;
