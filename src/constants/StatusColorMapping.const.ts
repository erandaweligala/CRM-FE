const STATUS_COLOR_MAPPING: Record<string, { color: string; bgColor: string }> = {
    "AttemptedToContact": { color: "#438D8D", bgColor: "#EAF5F5" },
    "ContactInFuture": { color: "#A55EA3", bgColor: "#FCF0FF" },
    "JunkLead": { color: "#E08810", bgColor: "#FFEFE5" },
    "LostLead": { color: "#D35555", bgColor: "#FFF2F2" },
    "Contacted": { color: "#004EB9", bgColor: "#EDF1F5" },
    "NotContacted": { color: "#CCA500", bgColor: "#FFFAE8" },
    "ConvertedToDeal": { color: "#5FB900", bgColor: "#EBF6E6" },
    "ConvertedToOpportunity": { color: "#5FB900", bgColor: "#EBF6E6" },
    "Approved": { bgColor: "#E6F7F1", color: "#16A34A" },
    "initialized": { color: "#3F82FC", bgColor: "#F0F5FD" },
    "validated": { color: "#5FB900", bgColor: "#EBF6E6" },
    "needsAnalysis": { color: "#3F82FC", bgColor: "#F0F5FD" },
    "negotiationOrReview": { color: "#A55EA3", bgColor: "#FCF0FF" },
    "valueProposition": { color: "#E08810", bgColor: "#FFEFE5" },
    "closedLost": { color: "#D35555", bgColor: "#FFF2F2" },
    "identifyDecisionMakers": { color: "#004EB9", bgColor: "#EDF1F5" },
    "proposalOrPriceQuote": { color: "#CCA500", bgColor: "#FFFAE8" },
    "closedWon": { color: "#5FB900", bgColor: "#EBF6E6" },
    "Need Analysis": {color: "#438D8D", bgColor: "#EAF5F5"},
    "Negotiation/Review": {color: "#A55EA3", bgColor: "#FCF0FF"},
    "Value Proposition": {color: "#E08810", bgColor: "#FFEFE5"},
    "Closed Lost": {color: "#D35555", bgColor: "#FFF2F2"},
    "Identify Decision Makers": {color: "#004EB9", bgColor: "#EDF1F5"},
    "Proposal/Price Quote": {color: "#CCA500", bgColor: "#FFFAE8"},
    "Closed Won": {color: "#5FB900", bgColor: "#EBF6E6"},
    "Error": {color: "#D35555", bgColor: "#FFF2F2"},
    "brcApproved":{color: "#5FB900", bgColor: "#EBF6E6"},
    "brcPendingApproval":{ color: "#F7941E", bgColor: "#FEF4E7" },
   
   
};

export default STATUS_COLOR_MAPPING;

