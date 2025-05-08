import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Button, Dropdown, Tab, Tabs, Toast } from "react-bootstrap";

import NewLayoutModal from "../components/modals/new-layout";
import NewSwitchModal from "../components/modals/new-switch";
import { Config, Configuration, DefaultApi, Layouts } from "../api";
import LayoutPicker from "../components/inputs/layout-picker";

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
  let [config, setConfig] = React.useState<Config | undefined>(undefined)
  let [currentSwitch, setCurrentSwitch] = React.useState<string | undefined>(undefined)
  let [currentLayout, setCurrentLayout] = React.useState<string | undefined>(undefined)

  let [showNewSwitch, setShowNewSwitch] = React.useState(false)

  let apiBase = process.env.GATSBY_API_BASE ?? '.'

  const api = new DefaultApi(new Configuration({
    basePath: apiBase,
  }))

  let sw = currentSwitch ? config?.switches[currentSwitch] : undefined

  React.useEffect(() => {
    if (loading) {
      return () => {}
    }

    let ignore = false
    setLoading(true)

    api
      .getConfig()
      .then(response => {
        if (!response.data.switches) {
          response.data.switches = {}
        }

        setConfig(response.data)
        setCurrentSwitch(Object.keys(response.data.switches).length > 0
            ? Object.keys(response.data.switches)[0]
            : undefined)
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
            onClick={() => setShowNewSwitch(true)}
          >
            + New switch
          </Button>
        </div>
        <div style={styles.content}>
          <div style={styles.sidebar}>
          {Object.keys(sw?.layouts ?? {}).map(name => (
            <Button
              key={name}
              style={styles.sidebarItem}
              onClick={() => {
                console.log(`Selecting ${name}`, sw?.layouts[name as keyof Layouts])
                setCurrentLayout(name)
              }}
            >
              {name}
            </Button>
          ))}
            <LayoutPicker
              switch={sw}
              onPick={async (key, layout) => {
                console.log('selected', key)

                if (!sw) return

                sw.layouts[key] = layout
                if (!!config?.switches && !!currentSwitch) {
                  config.switches[currentSwitch] = sw
                  await api.putConfig(config)
                }
              }}
            />
          </div>
          <div style={styles.content}>Editing buttons</div>
        </div>
      </div>
      <NewSwitchModal 
        show={showNewSwitch}
        onHide={() => {
          setShowNewSwitch(false)
        }}
        onConfirm={async remoteName => {
          if (!config) {
            config = {
              switches: {}
            }
          }

          if (!config.switches) {
            config = {
              switches: {}
            }
          }

          if (config.switches[remoteName]) {
            throw new Error('Cannot add remote')
          }
          
          config.switches[remoteName] = {
            layouts: {},
          }

          const res = await api.putConfig(config)
          setConfig(res.data)

          return res.data
        }}
      />
    </main>
  )
}

export default IndexPage
