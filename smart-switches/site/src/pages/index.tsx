import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: 'flex',
    position: 'absolute',
    color: "#232129",
    top: 0,
    left: 0,
    flexDirection: 'row',
    height: '100vh',
    width: '100vw',
    margin: 0,
    padding: 0,
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    width: '20%',
    minWidth: 250,
    maxWidth: 500,
    height: '100%',
    borderRight: 'solid 1px gray',
  },
  header: {

  },
  sidebarItem: {
    display: 'flex',
    width: 'calc(100% -16px)',
    padding: 8,
  },
}

/*
  * Rooms
    * Switches
      *  Configuration
  
  Sidebar for rooms and switches
  Main window for configuration?
 */

const IndexPage: React.FC<PageProps> = () => {
  let [loading, setLoading] = React.useState(false)
  let [switches, setSwitches] = React.useState<string | undefined>(undefined)

  console.log(switches)

  let remotes = ['one', 'two', 'three'].map(name => (
    <div style={styles.sidebarItem}>{name}</div>
  ))

  return (
    <main style={styles.page}>
      <div style={styles.sidebar}>
        {remotes}
      </div>
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
