const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/dashboard/Sidebar.jsx', 'utf8');

// Insert hook logic after props
content = content.replace(
  '  onOpenKemampuan,\n}) => {\n  return (',
  `  onOpenKemampuan,\n}) => {\n  const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 1024);\n\n  React.useEffect(() => {\n    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);\n    window.addEventListener("resize", handleResize);\n    return () => window.removeEventListener("resize", handleResize);\n  }, []);\n\n  const collapsed = isSidebarCollapsed && isDesktop;\n\n  return (`
);

// Replace isSidebarCollapsed logic inside JSX, EXCEPT for the set state
// We only want to replace it for rendering logic.
// Find all isSidebarCollapsed?
content = content.replace(/isSidebarCollapsed \?/g, 'collapsed ?');
content = content.replace(/!isSidebarCollapsed &&/g, '!collapsed &&');

// Restore the toggle button onClick logic
content = content.replace(
  /onClick=\{\(\) => setIsSidebarCollapsed\(!collapsed\)\}/g,
  'onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}'
);

// The Chevron button
content = content.replace(
  '{collapsed ? (\n            <ChevronRight',
  '{isSidebarCollapsed ? (\n            <ChevronRight'
);

// Width class string
// The container width in JSX:
// \${collapsed ? "w-[280px] lg:w-[100px]" : "w-[280px]"}
// wait, if collapsed is false on mobile, we still get w-[280px] which is correct!
// on desktop if collapsed is true, we get "w-[280px] lg:w-[100px]" -> evaluates to 100px on lg. Correct!

fs.writeFileSync('frontend/src/components/dashboard/Sidebar.jsx', content);
