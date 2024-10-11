import MultiSelect from "./components/MultiSelect"
import BaseLayout from "./layout/BaseLayout"

function App() {
  const defaultOptions = [
    { label: 'Bitcoin', id: '1' },
    { label: 'Ethereum', id: '2' },
    { label: 'Bitcoin cash', id: '3' },
    { label: 'Shiba', id: '4' },
  ];

  const output = (data) => {
    console.log("======>", data);
  }

  return (
    <BaseLayout>
      <MultiSelect defaultOptions={defaultOptions} outPut={output} multiple />
    </BaseLayout>
  )
}

export default App
