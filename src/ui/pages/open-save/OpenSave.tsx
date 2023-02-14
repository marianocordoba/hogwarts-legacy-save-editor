import { Pane, Text, Button } from 'evergreen-ui'
import { useNavigate } from 'react-router-dom'

export const OpenSave = () => {
  const navigate = useNavigate()

  const handleOpenSave = async () => {
    const success = await window.HLSE.openSave()

    if (success) {
      navigate('/edit')
    }
  }

  return (
    <Pane height='100%' display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
      <Text color='muted'>Open a save file to start editing</Text>
      <Button appearance='primary' intent='success' size='large' marginTop={16} onClick={handleOpenSave}>Select File</Button>
    </Pane>
  )
}
