import {FC} from "react";
import {Empty, Tag} from "antd";
import { getSecureRandomIndex } from "../../../../../../helpers/random-number-generate";

interface SkillsProps {
    data: string[];
}

const Skills: FC<SkillsProps> = ({ data }) => {
    const tagColors = ["blue", "green", "geekblue", "purple", "magenta", "volcano", "gold", "cyan", "lime"];
    const skillsTags = data.map((singleSkill) => {
        const randomColor = tagColors[getSecureRandomIndex(tagColors.length)];
        return <Tag color={randomColor} className="ml-2" key={singleSkill}>{singleSkill}</Tag>
    })

    return <>
        {data.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Empty className="mt-4 mb-3" description={"No Skills Available"} />
            </div>
        ) : (
            skillsTags
        )}
    </>;
}

export default Skills;