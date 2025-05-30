function checkRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: "Unauthorized: No user role found" });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Unauthorized: Insufficient permissions" });
        }
        next();
    };
}

module.exports = checkRole;