export const compare_logged_identity_with_identity_id_param = ({ required } = {}) => (req, res, next) => {
  if (req.params.user_id == req.user._id) {
    next()
  } else {
    res.status(401).json({message: 'access denied'})
  }
}
 