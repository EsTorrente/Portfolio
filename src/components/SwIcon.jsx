import { softwareIcon } from '../utils/assets';
// Small program logo (Blender, Maya…) shown next to a name. Renders nothing if the name has no icon or the file is missing.
export default function SwIcon({ name, className = 'swi' }) {
  const src = softwareIcon(name); if (!src) return null;
  return <img className={className} src={src} alt="" draggable="false" onError={(e) => { if (e.target) e.target.style.display = 'none'; }} />;
}
