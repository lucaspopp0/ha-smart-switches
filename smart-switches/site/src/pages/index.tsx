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
import { AnyLayout, ButtonsByLayout } from "../api/convenience";
import ExecutablePicker from "../components/inputs/executable-picker";
import { Button, Menu } from "antd";
import { ItemType, MenuItemGroupType, MenuItemType } from "antd/lib/menu/interface";
import { CaretRightFilled, DeleteOutlined } from "@ant-design/icons";
import ConfirmModal from "../components/modals/confirm";
import LayoutEditor from "../components/editors/layout";

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
  let [currentLayout, setCurrentLayout] = React.useState<keyof Layouts | undefined>(undefined)

  const deleteSwitch = async (name: string) => {
    if (config?.switches) {
      delete config.switches[name]

      try {
        await api.putConfig(config)
        setConfig(config)
        forceRefresh()
      } catch(e) {
        console.error(e)
      }
    }
  }

  const deleteLayout = async (name: string) => {
    if (config?.switches && currentSwitch && sw) {
      sw.layouts[name as keyof Layouts] = undefined

      config.switches[currentSwitch] = sw

      try {
        api.putConfig(config)
        setConfig(config)
        forceRefresh()
      } catch(e) {
        console.error(e)
      }
    }
  }

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
            setCurrentLayout(Object.keys(response.data.switches[0].layouts)[0] as keyof Layouts)
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

  const [showConfirmDeleteSwitch, setShowConfirmDeleteSwitch] = React.useState(false)
  const confirmDeleteSwitchModal = (<ConfirmModal
    title={"Confirm deletion"}
    body={<>
      {`Are you sure you want to delete ${currentSwitch}?`}
      <br/>
      {`This cannot be undone.`}
    </>}
    open={showConfirmDeleteSwitch}
    okButtonProps={{
      color: 'danger',
      title: 'Delete'
    }}
    onOk={() => deleteSwitch(currentSwitch as string)}
    onCancel={() => {
      setShowConfirmDeleteSwitch(false)
    }}
  />)

  const [showConfirmDeleteLayout, setShowConfirmDeleteLayout] = React.useState(false)
  const confirmDeleteLayoutModal = (<ConfirmModal
    title={"Confirm deletion"}
    body={<>
      {`Are you sure you want to delete ${currentLayout} of ${currentSwitch}?`}
      <br/>
      {`This cannot be undone.`}
    </>}
    open={showConfirmDeleteLayout}
    okButtonProps={{
      color: 'danger',
      title: 'Delete'
    }}
    onOk={() => deleteLayout(currentLayout as keyof Layouts)}
    onCancel={() => {
      setShowConfirmDeleteLayout(false)
    }}
  />)

  const switchesMenu = (
    <Menu
      style={styles.sidebar}
      onSelect={({ key }) => {
        if (key == "add-new") {
          return
        }

        setCurrentSwitch(key)
        setCurrentLayout(Object.keys(config?.switches[key].layouts ?? {})[0] as keyof Layouts)
      }}
      items={[
        ...(Object.keys(config?.switches ?? {}).length
          ? Object.keys(config?.switches ?? {}).map((name: string): MenuItemType => (
            {
              key: name,
              label: name,
              extra: <Button
                color="danger"
                variant="text"
                icon={<DeleteOutlined />}
                onClick={async () => {
                  setShowConfirmDeleteSwitch(true)
                }}
              />,
            } ))
          : [{
            key: 'none',
            disabled: true,
            label: 'Add a switch to get started'
          }]),
        {
          key: 'add-new',
          disabled: true,
          label: <Button
            onClick={() => {
              setShowNewSwitch(true)
            }}
          >Add switch</Button>,
        }
      ]}
    />
  )

  const layoutsMenu = (
    <Menu
      style={styles.sidebar}
      onSelect={({ key }) => {
        if (key == 'add-new') {
          return
        }

        console.log(`Selecting ${key}`, sw?.layouts[key as keyof Layouts])
        setCurrentLayout(key as keyof Layouts)
      }}
      items={
        sw ? [
          ...(Object.keys(sw.layouts).length
            ? Object.keys(sw.layouts).map((name: string): MenuItemType => (
              {
                key: name,
                label: name,
                extra: <Button
                  color="danger"
                  variant="text"
                  icon={<DeleteOutlined />}
                  onClick={async () => {
                    setShowConfirmDeleteLayout(true)
                  }}
                />,
              }))
            : [
              {
                key: 'helptext',
                disabled: true,
                label: 'Add a layout set up commands'
              }
            ]),
          {
            key: 'add-new',
            disabled: true,
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
        ] : []
      }
    />
  )

  return (
    <main style={styles.page}>
      <Navbar expand="lg" style={styles.header}>
          <Navbar.Brand href="#home">Smart Switches</Navbar.Brand>
      </Navbar>
      <div style={styles.content}>
        {switchesMenu}
        {layoutsMenu}
        <LayoutEditor
        api={api}
        config={config}
        currentSwitch={currentSwitch}
        currentLayout={currentLayout}
        onUpdate={async (latestConfig) => {
          try {
            await api.putConfig(latestConfig)
            setConfig(latestConfig)
            forceRefresh()
          } catch (err) {
            console.error(err)
          }
        }}        
        />
      </div>
      {confirmDeleteSwitchModal}
      {confirmDeleteLayoutModal}
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
