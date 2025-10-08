import { useState, useRef, useEffect } from 'react';

export default function useDropdown() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const caretRef = useRef(null);
  const [dropdownLeft, setDropdownLeft] = useState(null);

  useEffect(() => {
    function onDocClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    function computeLeft() {
      if (!rootRef.current || !caretRef.current) return;
      const headerRect = rootRef.current.getBoundingClientRect();
      const caretRect = caretRef.current.getBoundingClientRect();
      const arrowOffsetInside = 20;
      const extraShift = 8;
      const caretCenter = caretRect.left - headerRect.left + caretRect.width / 2;
      const dropdownLeftValue = Math.max(0, Math.round(caretCenter - arrowOffsetInside - extraShift));
      setDropdownLeft(dropdownLeftValue + 'px');
    }
    if (open) computeLeft();
    window.addEventListener('resize', computeLeft);
    return () => window.removeEventListener('resize', computeLeft);
  }, [open]);

  return { open, setOpen, rootRef, caretRef, dropdownLeft };
}
