require('dotenv').config();
const express = require('express');
const Sequelize = require('sequelize');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './persistence/queue-monitor.sqlite'
});

const Model = Sequelize.Model;
class Agent extends Model {};
Agent.init({
  agentId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'agent'
});

class Instance extends Model {};
Instance.init({
  instanceId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
}, {
  sequelize,
  modelName: 'instance'
});

class AgentInstance extends Model {};
AgentInstance.init({
    agentInstanceId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
  },
}, {
  sequelize,
  modelName: 'agent_instance'
});

app.get('/agent/:id', async (req, res) => {
    const agent = await Agent.findOne({
        where: {agentId: req.params.id},
    });
    if(agent){
        res.status(200).json(agent.dataValues);
    } else {
        res.status(404).json({ success: false});
    }
});
app.post('/agent', async (req, res) => {
    if(req.body && req.body.name){
        const agent = await Agent.create({
            name: req.body.name
        });
        if(agent){
            res.status(200).json(agent.dataValues);
        } else {
            res.status(500).json({success: false});
        }
    } else {
        res.status(400).json({success: false});
    }
});

// This is how the actual consultation of a serviceNow instance should look
app.get('*', async (req, res) => {
    const config = {
        credentials: "include",
        headers: {
          Authorization: "Basic " + Buffer.from(`${process.env.USERNAME}:${process.env.PASSWORD}`).toString('base64')
        }
    };
    const resp = 
        await fetch(`https://clstest.service-now.com/api/now/table/task?sysparm_query=assigned_to%3D7a7f0886db74ef40f521dcd7489619aa%5Eactive%3Dtrue&sysparm_fields=sys_class_name%2Cnumber%2Cpriority`, config);
    const json = await resp.json();
    res.status(200).json({success: true, response: JSON.stringify(json)});
})

app.listen(process.env.PORT || 8080, function(){
    if(process.env.CREATE_DATABASE == true){
        Agent.sync({ force: true });
        Instance.sync({ force: true });
        AgentInstance.sync({ force: true });
    }
    console.log(`Server listening on port ${this.address().port}`);
})