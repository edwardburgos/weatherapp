const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('country', {
    nameLower: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    nameNormal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    codeBig: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });


};


// {nombre, heightmax, heightmin, weightmax, weightmin, temperaments} = req.body;