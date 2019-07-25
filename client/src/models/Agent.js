class Agent {
  API_URL = "/agent";
  constructor(agentId, name) {
    this.agentId = agentId;
    this.name = name;
  }
  static async getById(agentId) {
    const res = await fetch(`${this.API_URL}/${agentId}`);
    const json = await res.json();
    const instance = new Agent(json.agentId, json.name);
    return instance;
  }
}
