import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Button } from "react-bootstrap";

const borderColor = 'rgb(224, 229, 229)';
const backgroundColor = 'white';

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: 'flex',
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    margin: 0,
    padding: 0,
  },
  header: {
    paddingLeft: 12,
    paddingRight: 12,
    background: 'white',
    fontWeight: 'bold',
  },
  content: {
    borderTop: `solid 1px ${borderColor}`,
    display: 'flex',
    color: "#232129",
    flexDirection: 'row',
    flexGrow: 2,
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
    background: backgroundColor,
    borderRight: `solid 1px ${borderColor}`,
  },
  sidebarItem: {
    display: 'flex',
    width: '100%',
    padding: 12,
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: `solid 1px ${borderColor}`,
    borderRadius: 0,
    background: backgroundColor,
    color: 'inherit',
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

  console.log('rendering')

  React.useEffect(() => {
    if (loading) {
      return
    }

    setLoading(true)

    fetch('../config')
      .then(resp => {
        resp.json().then(json => {
          console.log('Switches: ', json)
          setSwitches(json)
        })
      })
  }, [loading, switches, setLoading, setSwitches])

  console.log(switches)

  let remotes = ['one', 'two', 'three'].map(name => (
    <Button key={name} style={styles.sidebarItem}>{name}</Button>
  ))

  return (
    <main style={styles.page}>
      <Navbar expand="lg" style={styles.header}>
          <Navbar.Brand href="#home">Smart Switches</Navbar.Brand>
      </Navbar>
      <div style={styles.content}>
        <div style={styles.sidebar}>
          {remotes}
        </div>
      </div>
    </main>
  )
}

export default IndexPage
