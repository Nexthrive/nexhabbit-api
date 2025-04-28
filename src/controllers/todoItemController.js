const TodoItem = require('/models/TodoItem');

exports.createTodoItem = async (req, res) => {
    try {
        const todoItem = new TodoItem(req.body);
        await todoItem.save();
        res.status(201).json(todoItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getTodoItems = async (req, res) => {
    try {
        const todoItems = await TodoItem.find();
        res.json(todoItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTodoItemById = async (req, res) => {
    try {
        const todoItem = await TodoItem.findById(req.params.id);
        if (!todoItem) return res.status(404).json({ error: 'Todo item not found' });
        res.json(todoItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTodoItem = async (req, res) => {
    try {
        const todoItem = await TodoItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!todoItem) return res.status(404).json({ error: 'Todo item not found' });
        res.json(todoItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteTodoItem = async (req, res) => {
    try {
        const todoItem = await TodoItem.findByIdAndDelete(req.params.id);
        if (!todoItem) return res.status(404).json({ error: 'Todo item not found' });
        res.json({ message: 'Todo item deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
