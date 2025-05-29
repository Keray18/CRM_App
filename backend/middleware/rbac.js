const requireStandardEmployee = (req, res, next) => {
    if (req.user && (req.user.role === 'standard' || req.user.role === 'admin')) {
        return next();
    }
    return res.status(403).json({ message: 'Access denied: Standard employees only.' });
};

const requirePrivilegedEmployee = (req, res, next) => {
    if (req.user && (req.user.role === 'privileged' || req.user.role === 'admin')) {
        return next();
    }
    return res.status(403).json({ message: 'Access denied: Privileged employees only.' });
};

const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Access denied: Admins only.' });
};

module.exports = { requireStandardEmployee, requirePrivilegedEmployee, requireAdmin }; 