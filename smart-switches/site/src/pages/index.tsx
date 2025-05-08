import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import NewLayoutModal from "../components/modals/new-layout";
import NewSwitchModal from "../components/modals/new-switch";
import { Config, Configuration, DefaultApi, Layouts, LayoutV4, ListExecutablesResponseBody, Switch } from "../api";
import LayoutPicker from "../components/inputs/layout-picker";
import { ButtonsByLayout } from "../api/convenience";
import ExecutablePicker from "../components/inputs/executable-picker";
import { Button, Menu } from "antd";
import { ItemType, MenuItemGroupType, MenuItemType } from "antd/lib/menu/interface";
import { DeleteOutlined } from "@ant-design/icons";

const borderColor = 'rgb(224, 229, 229)';
const backgroundColor = 'white';
const selectedColor = 'rgb(0, 255, 255)';

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
  selectedItem: {
    background: selectedColor,
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
  let [refresh, setRefresh] = React.useState(false)
  let [loading, setLoading] = React.useState(false)

  let [executables, setExecutables] = React.useState({} as ListExecutablesResponseBody['executables'])
  let [fetchingExecutables, setFetchingExecutables] = React.useState(false)

  let [config, setConfig] = React.useState<Config | undefined>(undefined)
  let [currentSwitch, setCurrentSwitch] = React.useState<string | undefined>(undefined)
  let [currentLayout, setCurrentLayout] = React.useState<string | undefined>(undefined)

  const forceRefresh = () => setRefresh(!refresh)

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

        if (response.data.switches?.length) {
          setCurrentSwitch(Object.keys(response.data.switches)[0])

          if (Object.keys(response.data.switches[0].layouts).length > 0) {
            setCurrentLayout(Object.keys(response.data.switches[0].layouts)[0])
          }
        }
      })

    return () => {
      ignore = true
    }
  }, [loading, setLoading, config, setConfig])

  React.useEffect(() => {
    if (fetchingExecutables) {
      return () => {}
    }

    let ignore = false
    setFetchingExecutables(true)

    api
      .listExecutables()
      .then(response => {
        setExecutables(response.data.executables ?? {})
      })

    return () => {
      ignore = true
    }
  }, [fetchingExecutables, setFetchingExecutables, executables, setExecutables])

  const currentButtons = currentLayout ? ButtonsByLayout[currentLayout as keyof Layouts] : []

  return (
    <main style={styles.page}>
      <Navbar expand="lg" style={styles.header}>
          <Navbar.Brand href="#home">Smart Switches</Navbar.Brand>
      </Navbar>
      <div style={styles.content}>
        <Menu
          style={styles.sidebar}
          onSelect={({ key }) => {
            if (key == "add-new") {
              setShowNewSwitch(true)
              return
            }

            console.log(`Selecting ${key}`, config?.switches[key])
            setCurrentSwitch(key)
            setCurrentLayout(Object.keys(config?.switches[key].layouts ?? {})[0])
          }}
          items={
            [
              ...Object.keys(config?.switches ?? {}).map((name: string): MenuItemType => ({
                key: name,
                label: name,
                extra: <Button
                  color="danger"
                  variant="text"
                  icon={<DeleteOutlined />}
                  onClick={async () => {
                    if (config?.switches) {
                      delete config.switches[name]

                      api.putConfig(config).
                        then(() => {
                          setConfig(config)
                          forceRefresh()
                        })
                        .catch(console.error)
                    }
                  }}
                />,
              })),
              {
                key: 'add-new',
                label: '+ New switch',
              }
            ]
          }
        />
        <Menu
          style={styles.sidebar}
          onSelect={({ key }) => {
            if (key == 'add-new') {
              return
            }

            console.log(`Selecting ${key}`, sw?.layouts[key as keyof Layouts])
            setCurrentLayout(key)
          }}
          items={
            [
              ...Object.keys(sw?.layouts ?? {}).map((name: string): MenuItemType => ({
                key: name,
                label: name,
                extra: <Button
                  color="danger"
                  variant="text"
                  icon={<DeleteOutlined />}
                  onClick={async () => {
                    if (config?.switches && currentSwitch && sw) {
                      delete sw.layouts[name as keyof Layouts]

                      config.switches[currentSwitch] = sw

                      api.putConfig(config).
                        then(() => {
                          setConfig(config)
                          forceRefresh()
                        })
                        .catch(console.error)
                    }
                  }}
                />,
              })),
              {
                key: 'add-new',
                label: (
                  <LayoutPicker
                    switch={sw}
                    onPick={async (key, layout) => {
                      if (!sw) return
      
                      sw.layouts[key] = layout
                      if (!!config?.switches && !!currentSwitch) {
                        config.switches[currentSwitch] = sw
                        await api.putConfig(config)
                        setCurrentLayout(key)
                      }
                    }}
                  />
                )
              }
            ]
          }
        />
        <div style={styles.content}>
          <div style={{ display: 'flex', flexGrow: 2, }} />
          <div style={{ ...styles.sidebar, width: 400 }}>
            {currentButtons.map(buttonName => (
              <div style={styles.sidebarItem}>
                {buttonName}
                <div style={{ display: 'flex', flexGrow: 2, }} />
                <ExecutablePicker
                  value={sw?.layouts[currentLayout as keyof Layouts]?.[buttonName as keyof Layouts[keyof Layouts]]}
                  executables={executables}
                  onPick={async picked => {
                    if (sw && currentLayout && buttonName && config && currentSwitch) {
                      const layout = sw.layouts[currentLayout as keyof Layouts]
                      if (layout) {
                        layout[buttonName as keyof typeof layout] = picked?.entityId
                      }

                      sw.layouts[currentLayout as keyof Layouts] = layout

                      config.switches[currentSwitch].layouts[currentLayout as keyof Layouts] = layout
                      setConfig(config)
                      
                      api.putConfig(config).
                        then(() => forceRefresh()).
                        catch(console.error)
                    }
                  }}
                />
                </div>
            ))}
          </div>
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
