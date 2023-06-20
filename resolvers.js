const fs = require('fs');
const world = require('./world');

function saveWorld(context) {
    fs.writeFile("userworlds/" + context.user + "-world.json",

   JSON.stringify(context.world), err => {
    if (err) {
    console.error(err)
    throw new Error(
    `Erreur d'écriture du monde coté serveur`)
    }
    })
   }

module.exports = {
    Query: {
    getWorld(parent, args, context) {
        saveWorld(context)
    return context.world
    }
    },
    Mutation: {
        acheterQtProduit: (_, args,context) => {
            const produit = context.world.products.find((p) => p.id === args.id);
      
            if (!produit) {
              throw new Error(`Le produit avec l'id ${args.id} n'existe pas`);
            }
        
              // Augmenter la quantité du produit
              
        
              // Calculer le coût total de l'achat en tenant compte de la croissance
              const coutTotalAchat = produit.cout * (Math.pow(produit.croissance, args.quantite) - 1) / (produit.croissance - 1);
        
              if (context.world.money < coutTotalAchat) {
                throw new Error("Vous n'avez pas suffisamment d'argent pour effectuer cet achat");
              }
             
        
              // Déduire le coût total de l'achat de l'argent du monde
              context.world.money -= coutTotalAchat;
        
              // Mettre à jour le coût d'achat du produit en fonction de la croissance
              produit.cout *= Math.pow(produit.croissance, args.quantite);
              if(args.quantite==1 && produit.quantite==0){
                console.log(produit.revenu+ "+="+ produit.revenu);
                produit.quantite += args.quantite;
              }
              else{
                
                console.log(produit.revenu)
                produit.revenu += (produit.revenu/produit.quantite)*(args.quantite);
                console.log(produit.revenu+ "+="+ (produit.revenu+'/'+produit.quantite)+'*'+args.quantite );
                produit.quantite += args.quantite;
              }
              
              console.log("fumier")
              saveWorld(context)
              return produit;
            },

            lancerProductionProduit: (_, { id }, context) => {
                const produit = context.world.products.find((p) => p.id === id);
          
                if (!produit) {
                  throw new Error(`Le produit avec l'id ${id} n'existe pas`);
                }
                
                if (produit.quantite>0){
                produit.timeleft = produit.vitesse;
                context.world.lastupdate = Date.now();
                context.world.money += produit.revenu; 

            }
                
            

          
                // Sauvegarder les changements du monde
                // Code pour sauvegarder le monde, dépend de votre implémentation
                saveWorld(context)
                return produit;
              },

              engagerManager: (_, { name }, context) => {
                const manager = context.world.managers.find((m) => m.name === name);
              
                if (!manager) {
                  throw new Error(`Le manager avec le nom ${name} n'existe pas`);
                }
              
                if (context.world.money >= manager.seuil) {
                  const produit = context.world.products.find((p) => p.id === manager.idcible);
                  if (produit) {
                    produit.managerUnlocked = true;
                    manager.unlocked = true;
                    context.world.money -= manager.seuil;
                  } else {
                    throw new Error(`Le produit associé au manager n'existe pas`);
                  }
                } else {
                  throw new Error(`Vous n'avez pas assez pour acheter le manager`);
                }
              
                // Sauvegarder les changements du monde
                // Code pour sauvegarder le monde, dépend de votre implémentation
                console.log("fumier2")
                saveWorld(context)
                return manager;
              }
          }
        };

 
   