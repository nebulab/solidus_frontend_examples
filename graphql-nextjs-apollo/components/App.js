export default (props) => {
  const { children } = props
  return (
    <main>
      {children}
      <style jsx global>{`
      `}</style>
    </main>
  )
}
