import { useOutletContext } from "react-router-dom";
import SettingsPanel from "../components/SettingsPanel";

export default function Pengaturan() {
  const { settings, handleSaveSettings } = useOutletContext();

  return (
    <div className="col">
      <SettingsPanel settings={settings} onSave={handleSaveSettings} />
    </div>
  );
}
