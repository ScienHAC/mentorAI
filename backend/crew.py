from crewai import Agent, Crew, Task, Process, LLM
import yaml

from dotenv import load_dotenv

load_dotenv()

with open('config/agents.yaml') as f:
    agents_cfg = yaml.safe_load(f)

with open('config/tasks.yaml') as f:
    tasks_cfg = yaml.safe_load(f)

gemini_llm = LLM(
                model="gemini/gemini-1.5-pro-latest",
                temperature=0.7
            )

agents = {
    name: Agent(
        role=config['role'],
        goal=config['goal'],
        backstory=config['backstory'],
        llm=gemini_llm,
        verbose=True
    ) for name, config in agents_cfg.items()
}

tasks = [
    Task(
        description=config['description'],
        expected_output=config['expected_output'],
        agent=agents[config['agent']]
    ) for config in tasks_cfg.values()
]

mentor_ai_crew = Crew(
    agents=list(agents.values()),
    tasks=tasks,
    process=Process.sequential,
    verbose=True
)
