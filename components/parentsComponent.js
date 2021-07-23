
function Child ({data}) {
	const [data, setData]= useState(data)


	


	return ()

}

function Parent () {
	const [childData, setChildData]= useState({})
	const [nodeHistoryData]= useAtom(globalATom)
	useEffect(()=> {
		setChildData(nodehistoryData)
	}, [historyAction])

	return (
		childData.map((el)=> {<Child data={datah}></Child>})

	)


}