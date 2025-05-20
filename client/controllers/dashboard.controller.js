import Order from "../models/order.model.js"
import User from "../models/user.model.js"

export const getDetails = async (req, res, next)=>{

    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear()-1)

    const oneMonthAgo = new Date()
    oneMonthAgo.setDate(oneMonthAgo.getDate()-30)
    try {
        //! total sales
        const totalSale = await Order.aggregate([
            {
                $unwind : "$products"
            },
            {
                $project : {
                    lineTotal : {
                       $multiply :  ["$products.price", "$products.quantity" ]
                    }
                }
            },
            {
                $group : {
                    _id : null,
                    totalSale : {$sum : "$lineTotal"}
                }
            },
            {
                $project : {
                    _id : 0,
                    totalSale : 1
                }
            }
        ])
        const totalSales = totalSale[0]?.totalSale || 0


        //! yearly sales
        const yearlySale = await Order.aggregate([
            {
                $match : {createdAt : {$gte : oneYearAgo}}
            },
            {
                $unwind : "$products"
            },
            {
                $project : {
                    lineTotal : {
                        $multiply : ["$products.price", "$products.quantity"]
                    }
                }
            },
            {
                $group : {
                    _id : null,
                    yearlySale : {"$sum" : "$lineTotal"}
                }
            },
            {
                $project : {
                    _id : 0,
                    yearlySale : 1
                }
            }
        ])
        const yearlySales = yearlySale[0]?.yearlySale || 0


        //! monthly sales
        const monthlySale = await Order.aggregate([
            {
                $match : {createdAt : {$gte : oneMonthAgo}}
            },
            {
                $unwind : "$products"
            },
            {
                $project : {
                    lineTotal : {
                        $multiply : ["$products.price", "$products.quantity"]
                    }
                }
            },
            {
                $group : {
                    _id : null,
                    monthlySale : {$sum : "$lineTotal"}
                }
            },
            {
                $project : {
                    _id : 0,
                    monthlySale : 1
                }
            }
        ])
        const monthlySales = monthlySale[0]?.monthlySale || 0


        //! total order
        const totalOrder = await Order.aggregate([
            {
                $unwind : "$products"
            },
            {
                $group : {
                    _id : null,
                    totalOrder : {$sum : 1}
                }
            },
            {
                $project : {
                    _id : 0,
                    totalOrder : 1
                }
            }            
        ])
        const totalOrders = totalOrder[0]?.totalOrder || 0


        //! monthly order
        const monthlyOrder = await Order.aggregate([
            {
                $match : {createdAt : {$gte : oneMonthAgo}}
            },
            {
                $unwind : "$products"
            },
            {
                $group : {
                    _id : null,
                    monthlyOrder : {$sum : 1}
                }
            },
            {
                $project : {
                    _id : 0,
                    monthlyOrder : 1
                }
            }
        ])
        const monthlyOrders = monthlyOrder[0]?.monthlyOrder || 0 


        //! yearly order
        const yearlyOrder = await Order.aggregate([
            {
                $match : {createdAt : {$gte : oneYearAgo}}
            },
            {
                $unwind : "$products"
            },
            {
                $group : {
                    _id : null,
                    yearlyOrder : {$sum : 1}
                }
            },
            {
                $project : {
                    _id : 0,
                    yearlyOrder : 1
                }
            }
        ])
        const yearlyOrders = yearlyOrder[0]?.yearlyOrder || 0


        //! total users
        const totalUser = await User.aggregate([
            {
                $group : {
                    _id : null,
                    totalUser : {$sum : 1}
                }
            },
            {
                $project : {
                    _id : 0,
                    totalUser : 1
                }
            }
        ])
        const totalUsers = totalUser[0]?.totalUser || 0


        //! months new User
        const monthNewUser = await User.aggregate([
            {
                $match : {createdAt : {$gte : oneMonthAgo}}
            },
            {
                $group : {
                    _id : null,
                    monthNewUser : {$sum : 1}
                }
            },
            {
                $project : {
                    _id : 0,
                    monthNewUser : 1
                }
            }
        ])
        const monthNewUsers = monthNewUser[0]?.monthNewUser || 0


        //! payment method
        const paymentMethod = await Order.aggregate([
            {
                $group : {
                    _id : "$payment",
                    count : {$sum : 1}
                }
            }
        ])
        const paymentMethods = {}
        for (const item of paymentMethod){
            paymentMethods[item._id] = item.count
        }

        res.status(200).json({totalSales, yearlySales, monthlySales, totalOrders, yearlyOrders, monthlyOrders, totalUsers, monthNewUsers, paymentMethods})
    } catch (error) {
        console.log("get dashboard detail m h error", error)
        next(error)
    }
}