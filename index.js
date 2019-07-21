require("dotenv").config();
const express = require("express");
const Sequelize = require("sequelize");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./persistence/queue-monitor.sqlite"
});

const Model = Sequelize.Model;

// Models
class Agent extends Model {}
Agent.init(
  {
    agentId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "agent"
  }
);

class Instance extends Model {}
Instance.init(
  {
    instanceId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    url: {
      type: Sequelize.STRING,
      allowNull: false
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "instance"
  }
);

class AgentInstance extends Model {}
AgentInstance.init(
  {
    agentInstanceId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    instanceId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    agentId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    agentSysId: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "agent_instance"
  }
);

// routes
// Agent
app.get("/agent/:id", async (req, res) => {
  const agent = await Agent.findOne({
    where: { agentId: req.params.id }
  });
  if (agent) {
    res.status(200).json(agent.dataValues);
  } else {
    res.status(404).json({ success: false });
  }
});

app.post("/agent", async (req, res) => {
  if (req.body && req.body.name) {
    const agent = await Agent.create({
      name: req.body.name
    });
    if (agent) {
      res.status(200).json(agent.dataValues);
    } else {
      res.status(500).json({ success: false });
    }
  } else {
    res.status(400).json({ success: false });
  }
});

app.patch("/agent/:id", async (req, res) => {
  if (req.body && req.body.name) {
    const agent = await Agent.findOne({
      where: { agentId: req.params.id }
    });
    if (agent) {
      agent.update({
        name: req.body.name
      });
      res.status(200).json(agent.dataValues);
    } else {
      res.status(500).json({ success: false });
    }
  } else {
    res.status(400).json({ success: false });
  }
});

app.delete("/agent/:id", async (req, res) => {
  const agent = await Agent.findOne({
    where: { agentId: req.params.id }
  });
  if (agent) {
    agent.destroy();
    res.status(200).json({ success: true });
  } else {
    res.status(404).json({ success: false });
  }
});

// Instance
app.get("/instance/:id", async (req, res) => {
  const instance = await Instance.findOne({
    where: { instanceId: req.params.id }
  });
  if (instance) {
    res.status(200).json(instance.dataValues);
  } else {
    res.status(404).json({ success: false });
  }
});

app.post("/instance", async (req, res) => {
  if (
    req.body &&
    req.body.name &&
    req.body.url &&
    req.body.username &&
    req.body.password
  ) {
    const instance = await Instance.create({
      name: req.body.name,
      url: req.body.url,
      username: req.body.username,
      password: req.body.password
    });
    if (instance) {
      res.status(200).json(instance.dataValues);
    } else {
      res.status(500).json({ success: false });
    }
  } else {
    res.status(400).json({ success: false });
  }
});

app.patch("/instance/:id", async (req, res) => {
  if (
    req.body &&
    req.body.name &&
    req.body.url &&
    req.body.username &&
    preq.body.assword
  ) {
    const instance = await Instance.findOne({
      where: { instanceId: req.params.id }
    });
    if (instance) {
      instance.update({
        name: req.body.name,
        url: req.body.url,
        username: req.body.username,
        password: req.body.password
      });
      res.status(200).json(instance.dataValues);
    } else {
      res.status(500).json({ success: false });
    }
  } else {
    res.status(400).json({ success: false });
  }
});

app.delete("/instance/:id", async (req, res) => {
  const instance = await Instance.findOne({
    where: { instance: req.params.id }
  });
  if (instance) {
    instance.destroy();
    res.status(200).json({ success: true });
  } else {
    res.status(404).json({ success: false });
  }
});

// Agent-to-Instance
app.post("/agent-instance", async (req, res) => {});

app.delete("/agent-instance/:id", async (req, res) => {});

// This is how the actual consultation of a serviceNow instance should look
app.get("/get-queue/:id", async (req, res) => {
  if (req.body && req.params.id) {
    const queues = {};
    const agent = await Agent.findOne({
      where: { agentId: req.params.id }
    });
    if (agent) {
      const relations = await AgentInstance.findAll({
        agentId: agent.agentId
      });
      for (let relation of relations) {
        const instance = await Instance.findOne({
          where: { instanceId: relation.instanceId }
        });
        const json = await getQueue(instance, relation.agentSysId);
        queues[instance.url] = json;
      }
      res.status(200).json({ success: true, queues: queues });
    } else {
      res.status(404).json({ success: false });
    }
  }
});

// Miscellanea
const getQueue = async (instance, agentSysId) => {
  const config = {
    credentials: "include",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${instance.username}:${instance.password}`).toString(
          "base64"
        )
    }
  };
  const resp = await fetch(
    `${
      instance.url
    }/api/now/table/task?sysparm_query=assigned_to%${agentSysId}%5Eactive%3Dtrue&sysparm_fields=sys_class_name%2Cnumber%2Cpriority`,
    config
  );
  const json = await resp.json();
  return json;
};

app.listen(process.env.PORT || 8080, function() {
  if (process.env.CREATE_DATABASE == true) {
    Agent.sync({ force: true });
    Instance.sync({ force: true });
    AgentInstance.sync({ force: true });
  }
  console.log(`Server listening on port ${this.address().port}`);
});
