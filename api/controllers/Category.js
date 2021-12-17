

const path = require("path");

const fs = require("fs");
const Category = require("../services/Category");
const categoryService = new Category();
const index = (req, res) => {
    var id = req.params.id;
    categoryService.get(id).then(response => {
        if (!response) return res.status(404).send({ error: "Category nor found" });
        res.status(200).send(response)
    })
        .catch(err => res.status(500).send(err));
}

const create = (req, res) => {

    categoryService.save(req.body).then(response => res.status(200).send(response))
        .catch(err => res.status(500).send(err));
}
const update = (req, res) => {
    var id = req.params?.id;
    categoryService.updateWithID(id, req.body).then(response => res.status(200).send(response))
        .catch(err => res.status(500).send(err));
}
const remove = (req, res) => {
    var id = req.params?.id;

    categoryService.findById(id).then(category => {

        if (!category) return res.status(404).send({ error: "Category not found." })
        const folderPath = path.join(__dirname, "../", "./images", `${category.image}`);

        fs.unlink(folderPath, (err) => {

            categoryService.delete(id).then(response => res.status(200).send({
                message: "Category deleted.."
            })).catch(err => res.status(500).send(err));
        });

    }).catch(err => res.status(500).send({ msg: "err", err }));

}

const addSubCategory = (req, res) => {
    categoryService.findById(req.params?.id).then(mainCategory => {
        if (!mainCategory) {
            return res.status(404).send({
                message: "Category not found"
            });
        }
        categoryService.save(req.body).then(subCategory => {
            mainCategory.sub_categorys.push(subCategory);
            mainCategory.save().then(updatedCategory => {
                res.status(200).send(updatedCategory);
            }).catch(err => res.status(500).send(err));
        }).catch(err => res.status(500).send(err));
    }).catch(err => res.status(500).send(err));
}
const addCategoryImage = (req, res) => {
    const id = req.params.id;

    if (!req.files.category_image) {
        return res.status(500).send({ error: "Bu işlem için resim seçmelisiniz." });
    }
    const ex = path.extname(req.files.category_image.name);
    const folderPath = path.join(__dirname, "../", "./images/category", `/${id}${ex}`)
   
    req.files.category_image.mv(folderPath, (err) => {
        if (err) res.status(500).send(err);
        categoryService.updateWithID(id, { image: `/category/${id}${ex}` }).then(response => {
            res.status(200).send(response);
        }).catch(err => res.status(500).send(err))
    })

}

module.exports = {
    index,
    create,
    update,
    remove,
    addSubCategory,
    addCategoryImage
}