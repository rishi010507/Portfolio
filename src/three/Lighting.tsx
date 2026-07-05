export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.35} color="#2a2f5c" />
      <pointLight position={[6, 4, 6]} intensity={3} color="#22d3ee" distance={45} decay={2} />
      <pointLight position={[-8, -3, -10]} intensity={2.2} color="#8b5cf6" distance={55} decay={2} />
    </>
  );
}
