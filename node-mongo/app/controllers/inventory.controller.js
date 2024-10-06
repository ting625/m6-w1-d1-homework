const mongoose = require('mongoose');
//mongoose.set('useFindAndModify', false);
const Inventory = mongoose.model('Inventory');

exports.createInventory = (req, res) => {
        const inventory = new Inventory({
                            prodname: req.body.prodname,
                            qty: req.body.qty,
                            price: req.body.price,
                            status: req.body.status,
                           });

// Save a Inventroy in the MongoDB 
inventory.save().then(data => {
                res.status(200).json(data);
            }).catch(err => {
                res.status(500).json({
                    message: "Fail!",
                    error: err.message
                });
            });
};


//getInventory Function
exports.getInventory = (req, res) => {
    Inventory.findById(req.params.id).select('-___v')
        .then(inventory => {
            res.status(200).json(inventory);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Inventory not found with id " + req.params.id,
                    error: err
                });
        }
        return res.status(500).send({
            message: "Error retrieving Inventroy with id " + req.params.id,
            error: err
        });
    });
}; 


//get All Inventory Function
exports.inventories = (req, res) => {
    Inventory.find().select('-___v').then(inventoryinfos => {
        res.status(200).json(inventoryinfos);
    }).catch(error => {
        // log on console
        console.log(error);

        res.status(500).json({
            message: "Error!",
            error: error
        });
    });
}; 

//Delete Inventory Based on ID 
exports.deleteInventory = (req, res) => {
    Inventory.findByIdAndRemove(req.params.id).select('-___v-_id')
        .then(inventory => {
            if(!inventory) {
                res.status(404).json({
                    message: "No inventory found with id = " + req.params.id,
                    error: "404",
                });
            }
            res.status(200).json({});  
        }).catch(err => {
            return res.status(500).send({
                message: "Error -> Can't delete inventory with id = " + req.params.id,
                error: err.message
        });     
    });
}; 

//Find Inventory and Update it  
exports.updateInventory = (req, res) => {
    Inventory.findByIdAndUpdate(
    req.body._id,
        {
            prodname: req.body.prodname,
            qty: req.body.qty,
            price: req.body.price,
            status: req.body.status
        },
         {new: false}
    ).select('-__v')
        .then(inventory => {
          if(!inventory) {
            return res.status(404).send({
                message: "Error ->  Can't update an inventory with id = " + req.params.id,
                error: "Not Found!",
              });
            }
            res.status(200).json(inventory);  
        }).catch(err => {
            return res.status(500).send({
                message: "Error -> Can't update a inventory with id = " + req.params.id,
                error: err.message
            });     
        });
}; 
