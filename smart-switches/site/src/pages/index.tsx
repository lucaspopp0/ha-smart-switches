import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Button, Dropdown, Tab, Tabs } from "react-bootstrap";

import type { components } from '../sdk'
import NewLayoutModal from "../components/modals/new-layout";
import NewRemoteModal from "../components/modals/new-remote";

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
  let [config, setConfig] = React.useState<components["schemas"]["Config"] | undefined>(undefined)
  let [currentSwitch, setCurrentSwitch] = React.useState<string | undefined>(undefined)
  let [currentLayout, setCurrentLayout] = React.useState<string | undefined>(undefined)

  let [showNewRemote, setShowNewRemote] = React.useState(false)

  React.useEffect(() => {
    if (loading) {
      return () => {}
    }

    let ignore = false
    setLoading(true)

    fetch('./api/config')
      .then(res => {
        res.json().then(json => {
          const configJSON = json as components["schemas"]["Config"]

          if (!configJSON.switches) {
            configJSON.switches = {}
          }

          setConfig(configJSON)
          setCurrentSwitch(Object.keys(configJSON.switches).length > 0
            ? Object.keys(configJSON.switches)[0]
            : undefined)
        })
      })

    return () => {
      ignore = true
    }
  }, [loading, setLoading, config, setConfig])

  return (
    <main style={styles.page}>
      <Navbar expand="lg" style={styles.header}>
          <Navbar.Brand href="#home">Smart Switches</Navbar.Brand>
      </Navbar>
      <div style={styles.content}>
        <div style={styles.sidebar}>
          {Object.keys(config?.switches ?? {}).map(name => (
            <Button
              key={name}
              style={styles.sidebarItem}
              onClick={() => {
                console.log(`Selecting ${name}`, config?.switches[name])
                setCurrentSwitch(name)
                setCurrentLayout(Object.keys(config?.switches[name].layouts ?? {})[0])
              }}
            >
              {name}
            </Button>
          ))}
          <Button
            key="_"
            style={styles.sidebarItem}
            onClick={() => setShowNewRemote(true)}
          >
            + New remote
          </Button>
        </div>
        <div style={styles.content}>
          <div style={styles.sidebar}>
          {currentSwitch 
            ? <React.Fragment>
                {Object
                  .keys(config?.switches[currentSwitch].layouts ?? {})
                  .map(layoutName => (
                    <div key={layoutName} style={styles.sidebarItem}>
                      {layoutName}
                    </div>
                  ))}
                  <div key="add-layout" style={styles.sidebarItem}>
                    <Dropdown>
                      <Dropdown.Toggle>
                          Add layout...
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                          {['v4', 'v5', 'v6', 'v7'].map(layout => (
                              config?.switches[currentSwitch]
                              ? (layout in config.switches[currentSwitch].layouts
                                  ? <Dropdown.Item key={layout} disabled>{layout} (already configured)</Dropdown.Item>
                                  : <Dropdown.Item key={layout}>{layout}</Dropdown.Item>)
                              : ''
                          ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
              </React.Fragment>
            : "Select a switch"}
          </div>
          <div style={styles.content}>Editing buttons</div>
        </div>
      </div>
      <NewRemoteModal 
        show={showNewRemote}
        onHide={() => {
          setShowNewRemote(false)
        }}
        onConfirm={remoteName => {
          console.log('Add new remote:', remoteName)
        }}
      />
    </main>
  )
}

export default IndexPage
