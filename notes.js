const App = () => {
    const [query, setQuery] = useState(0);
    const [page, setPage] = useState(1);
    const isMounted = useRef(false);
  
    useEffect(() => {
      if (isMounted.current) {
        console.log("Call api when query changes");
      }
    }, [query]);
  
    useEffect(() => {
      if (isMounted.current) {
        console.log("Call api when page changes");
      }
    }, [page]);
  
    useEffect(() => {
      console.log("call api first time");
      isMounted.current = true;
    }, []);
  
    return (
      ...
    );
  };