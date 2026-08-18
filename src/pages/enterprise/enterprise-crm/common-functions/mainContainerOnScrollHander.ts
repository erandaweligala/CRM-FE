const mainContainerOnScrollHandler = (
    containerRef: React.RefObject<HTMLDivElement>,
    sectionsRef: React.RefObject<Record<string, HTMLDivElement>>,
    sectionList: string[],
    setSelectedSection: (section: string) => void,
): void=> {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;

    let updatedSection: string | undefined;

    sectionList.forEach((sectionKey) => {
        const sectionRef = sectionsRef.current![sectionKey];
        if (sectionRef && sectionRef.offsetTop !== undefined) {
            if (scrollTop >= sectionRef.offsetTop) {
                updatedSection = sectionKey;
            }
        }
    });

    if (updatedSection) {
        setSelectedSection(updatedSection);
    }
};

export default mainContainerOnScrollHandler;