import { Pane, Tablist, Tab, IconButton, Button, ArrowLeftIcon, Text, CogIcon, Popover, Menu, ImportIcon, ExportIcon, TextInputField, Table, TextInput, Switch } from "evergreen-ui"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { resources, sanctuary, talents } from "../../util/names"

export const EditSave = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, reset, watch, setValue, getValues } = useForm();
  const [data, setData] = useState<any>({})
  const [selectedTab, setSelectedTab] = useState<'player' | 'inventory' | 'talents'>('player')

  useEffect(() => {
    window.HLSE.getData().then(data => {
      setData(data)
      reset(data.player)
    })
  }, [])

  const handleBackClick = () => {
    navigate('/', { replace: true })
  }

  const handleImportDatabaseClick = async () => {
    await window.HLSE.importDatabase()
    window.HLSE.getData().then(data => {
      setData(data)
      reset(data.player)
    })
  }

  const handleExportDatabaseClick = async () => {
    await window.HLSE.exportDatabase()
  }

  const handleUnlockAllClick = async () => {
    talents.forEach(item => {
      setValue(`talents.${item.key}`, true)
    })
  }

  const handleRespecClick = async () => {
    let allocatedPoints = 0

    talents.forEach(item => {
      allocatedPoints += getValues(`talents.${item.key}`) ? 1 : 0
      setValue(`talents.${item.key}`, false)
    })

    setValue('misc.PerkPoints', parseInt(getValues('misc.PerkPoints'), 10) + allocatedPoints)
  }

  const onFormSubmit = async (values: unknown) => {
    console.log(values)
    const success = await window.HLSE.setData(values)

    if (success) {
      await window.HLSE.writeSave()
    }
  }

  return (
    <Pane height='100%' display='flex' flexDirection='column'>
      <Pane height={48} display='flex' alignItems='center' padding={8} background='#222'>
        <IconButton icon={<ArrowLeftIcon />} appearance='minimal' onClick={handleBackClick} />
        <Text flex={1} paddingLeft={8} paddingRight={8} color='#fff'>Editing {data.saveName}</Text>
        <Popover content={({ close }) => (
          <Menu>
            <Menu.Group>
              <Menu.Item icon={<ImportIcon />} onClick={() => {
                close()
                handleImportDatabaseClick()
              }}>Import Database</Menu.Item>
              <Menu.Item icon={<ExportIcon />} onClick={() => {
                close()
                handleExportDatabaseClick()
              }}>Export Database</Menu.Item>
            </Menu.Group>
          </Menu>
        )}>
          <IconButton icon={<CogIcon />} appearance='minimal' />
        </Popover>
      </Pane>
      <Pane display='flex' alignItems='center' padding={8} background='gray400'>
        <Tablist>
          <Tab isSelected={selectedTab === 'player'} onSelect={() => setSelectedTab('player')}>Player</Tab>
          <Tab isSelected={selectedTab === 'inventory'} onSelect={() => setSelectedTab('inventory')}>Inventory</Tab>
          <Tab isSelected={selectedTab === 'talents'} onSelect={() => setSelectedTab('talents')}>Talents</Tab>
        </Tablist>
      </Pane>
      <Pane minHeight={0} flex={1} padding={16} background='gray100'>
          <Pane aria-hidden={selectedTab !== 'player'} display={selectedTab === 'player' ? 'block' : 'none'} key='player' role='tabpanel'>
            <Pane display='grid' width='100%' gridTemplateColumns='repeat(2, 1fr)' gap='0 16px'>
              <TextInputField label='First Name' {...register('misc.PlayerFirstName')} />
              <TextInputField label='Last Name' {...register('misc.PlayerLastName')} />
              <TextInputField type='number' label='Experience' {...register('misc.ExperiencePoints')} />
              <TextInputField type='number' label='Inventory Capacity' {...register('misc.BaseInventoryCapacity')} />
            </Pane>
          </Pane>
          <Pane height='100%' aria-hidden={selectedTab !== 'inventory'} display={selectedTab === 'inventory' ? 'block' : 'none'} key='inventory' role='tabpanel'>
            <Pane height='100%' display='flex' flexDirection='column'>
              <Pane display='flex' width='100%' gap={16}>
                <TextInputField flex={1} type='number' label='Galleons' min={0} max={999999} {...register('inventory.resources.Knuts')} />
                <TextInputField flex={1} type='number' label='Wiggenweld Potions' min={0} max={25} {...register('inventory.health.WoundCleaning')} />
              </Pane>
              <Pane display='flex' width='100%' gap={16} marginBottom={8}>
                <Pane flex={1}>
                  <Text fontWeight={500} color='dark'>Resources</Text>
                </Pane>
                <Pane flex={1}>
                  <Text fontWeight={500} color='dark'>Sanctuary Wheel</Text>
                </Pane>
              </Pane>
              <Pane minHeight={0} display='flex' flexDirection='column' flex={1}>
                <Pane height='100%' display='flex' gap={16}>
                  <Pane flex={1} overflowY='auto'>
                    <Table>
                      <Table.Body>
                        {resources.map((item: typeof resources[number]) => (
                          <Table.Row key={item.key} height={48}>
                            <Table.TextCell>{item.value}</Table.TextCell>
                            <Table.TextCell flexBasis={100} flexShrink={0} flexGrow={0}>
                               <TextInput type='number' min={0} max={9999} width={72} {...register(`inventory.resources.${item.key}`)} />
                            </Table.TextCell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </Pane>
                  <Pane flex={1} overflowY='auto'>
                    <Table>
                      <Table.Body>
                        {sanctuary.map((item: typeof sanctuary[number]) => (
                          <Table.Row key={item.key} height={48}>
                            <Table.TextCell>{item.value}</Table.TextCell>
                            <Table.TextCell flexBasis={100} flexShrink={0} flexGrow={0}>
                               <TextInput type='number' min={0} max={9999} width={72} {...register(`inventory.sanctuary.${item.key}`)} />
                            </Table.TextCell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </Pane>
                </Pane>
              </Pane>
            </Pane>
          </Pane>
          <Pane height='100%' aria-hidden={selectedTab !== 'talents'} display={selectedTab === 'talents' ? 'block' : 'none'} key='talents' role='tabpanel'>
            <Pane height='100%' display='flex' flexDirection='column'>
              <Pane display='flex' width='100%' gap={16}>
                <TextInputField flex={1} type='number' label='Talent Points' {...register('misc.PerkPoints')} />
                <Pane flex={1} display='flex' alignItems='center' gap={16}>
                  <Button flex={1} onClick={handleUnlockAllClick}>Unlock All</Button>
                  <Button flex={1} onClick={handleRespecClick}>Respec</Button>
                </Pane>
              </Pane>
              <Pane display='flex' width='100%' gap={16} marginBottom={8}>
                <Pane flex={1}>
                  <Text fontWeight={500} color='dark'>Talents</Text>
                </Pane>
              </Pane>
              <Pane minHeight={0} display='flex' flexDirection='column' flex={1}>
                <Pane height='100%' display='flex' gap={16}>
                  <Pane flex={1} overflowY='auto'>
                    <Table>
                      <Table.Body>
                        {talents.map((item: typeof talents[number]) => (
                          <Table.Row key={item.key} height={48}>
                            <Table.TextCell>{item.value}</Table.TextCell>
                            <Table.TextCell paddingLeft={32} flexBasis={100} flexShrink={0} flexGrow={0}>
                              <Switch
                              {...register(`talents.${item.key}`)}
                              checked={watch(`talents.${item.key}`)}
                              onChange={e => setValue(`talents.${item.key}`, e.target.checked)} />
                            </Table.TextCell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </Pane>
                </Pane>
              </Pane>
            </Pane>
          </Pane>
      </Pane>
      <Pane height={48} display='flex' alignItems='center' justifyContent='flex-end' padding={8} background='#222'>
        <Button appearance='primary' intent='success' onClick={handleSubmit(onFormSubmit)}>Save</Button>
      </Pane>
    </Pane>
  )
}
